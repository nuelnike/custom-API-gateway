import {Request, Response, NextFunction} from 'express';
import {RedisGet, RedisSet, Increment} from '../../bootstrap/redis/index';
import {Encrypt, Decrypt} from '../../bootstrap/security/index'; 
import {ResponseStatus, IsEmpty} from '../../bootstrap/include/index';
import {Logger} from '../../bootstrap/include/logger';
import {BlackList} from '../../bootstrap/security/blacklist';
import fs  from 'fs';

export function ValidateIP(req: Request, res: Response, next:NextFunction)
{
    // RedisGet client ip
    const _ip:any = req.headers['x-forwarded-for'] || req.headers['forwarded-for'] || req.headers['forwarded'] || req.headers['x-client-ip'] || req.socket.remoteAddress || req.connection.remoteAddress;
    const _device:any = req?.useragent?.isDesktop ? 'desktop' : req?.useragent?.isMobile ? 'mobile' : req?.useragent?.isTablet ? 'tablet' : 'others';
    const _client:any = req?.useragent?.isAndroid ? 'android' : req?.useragent?.isAndroidTablet ? 'android' : req?.useragent?.isBlackberry ? 'blackberry' : req?.useragent?.isiPad ? 'ipad' : req?.useragent?.isiPhone ? 'iphone' : req?.useragent?.browser !== ' ' ? req?.useragent?.browser : 'others';
    const _date:any = new Date();

    let load_blacklist:any = fs.readFileSync(__dirname + '/../../bootstrap/files/blacklist.json', 'utf-8');
    let blacklist_file = IsEmpty(load_blacklist) ? [] : JSON.parse(load_blacklist);

    let blacklist_index:any = blacklist_file.findIndex((item:any) => item.ip == _ip);

    if(blacklist_index !== -1)
    {
        Logger('error', `${_client} tried accessing ${'/api/v1/auth/'+req.params.api_path} using blacklisted IP ${_ip}`);
        res.status(ResponseStatus.Forbidden.code).json({
            success: false,
            code: ResponseStatus.Forbidden.code,
            msg: ResponseStatus.Forbidden.msg
        });
    }
    else
    {
        let req_count:number = 0;
        async function GetIPReqCount() {    
            req_count = await RedisGet(_ip);// cache instance
        }

        GetIPReqCount() // RedisGet INSTANCE FROM CACHE
        .then(() => {
            if (req_count >= 21)
            {

                interface _struct {
                    ip:         any;
                    device:     any;
                    os:         any;
                    platform:   any;
                    client:     any;
                    end_point:  any;
                    date:       any;
                }

                const {ip, device, os, platform, client, end_point, date}:_struct = {ip: _ip, device: _device, os:req?.useragent?.os, platform:req?.useragent?.platform, client:_client, end_point: '/api/v1/auth/'+req.params.api_path, date:_date};

                BlackList({ip, device, os, platform, client, end_point, date});

                Logger('error', `After 20 concurrent request within a minute, api gateway blacklisted ${_ip} originating from ${_client}`);
                res.status(ResponseStatus.TooManyRequest.code).json({
                    success: false,
                    code: ResponseStatus.TooManyRequest.code,
                    msg: ResponseStatus.TooManyRequest.msg
                });
            }
            else
            {  
                // cache ip request to redis
                Increment(_ip, 60);
                next();
            }
        })
        .catch((err:any) => {
            Logger('error', `Failed request: ${err.message}`);
            res.status(ResponseStatus.InternalServerErr.code).json({
                success: false,
                code: ResponseStatus.InternalServerErr.code,
                msg: ResponseStatus.InternalServerErr.msg
            });
        });
    }
}