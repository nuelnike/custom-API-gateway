import {Request, Response, NextFunction} from 'express';
import {GET, SET, INCREMENT} from '../../../../engine/src/redis/index';
import {ENCRYPT, DECRYPT} from '../../../../engine/src/security/index'; 
import {RESPONSE_STATUS, CHECK_IF_EMPTY} from '../../../../engine/src/include/index';
import {LOGGER} from '../../../../engine/src/include/logger';
import {BLACKLIST} from '../../../../engine/src/security/blacklist';
import fs  from 'fs';

export function VALIDATE_IP(req: Request, res: Response, next:NextFunction)
{
    // get client ip
    const _ip:any = req.headers['x-forwarded-for'] || req.headers['forwarded-for'] || req.headers['forwarded'] || req.headers['x-client-ip'] || req.socket.remoteAddress || req.connection.remoteAddress;
    const _device:any = req?.useragent?.isDesktop ? 'desktop' : req?.useragent?.isMobile ? 'mobile' : req?.useragent?.isTablet ? 'tablet' : 'others';
    const _client:any = req?.useragent?.isAndroid ? 'android' : req?.useragent?.isAndroidTablet ? 'android' : req?.useragent?.isBlackberry ? 'blackberry' : req?.useragent?.isiPad ? 'ipad' : req?.useragent?.isiPhone ? 'iphone' : req?.useragent?.browser !== ' ' ? req?.useragent?.browser : 'others';
    const _date:any = new Date();

    let load_blacklist:any = fs.readFileSync(__dirname + '/../../../../engine/src/files/blacklist.json', 'utf-8');
    let blacklist_file = CHECK_IF_EMPTY(load_blacklist) ? [] : JSON.parse(load_blacklist);

    let blacklist_index:any = blacklist_file.findIndex((item:any) => item.ip == _ip);

    if(blacklist_index !== -1)
    {
        LOGGER('gateway', `Tried accessing ${'/api/v1/auth/'+req.params.api_path} using blacklisted IP ${_ip} from ${_client}`);
        res.status(RESPONSE_STATUS.FORBIDDEN.code).json({
            success: false,
            code: RESPONSE_STATUS.FORBIDDEN.code,
            msg: RESPONSE_STATUS.FORBIDDEN.msg
        });
    }
    else
    {
        let req_count:number = 0;
        async function GET_IP_REQUEST_COUNT() {    
            req_count = await GET(_ip);// cache instance
        }

        GET_IP_REQUEST_COUNT() // GET INSTANCE FROM CACHE
        .then(() => {
            if (req_count >= 20)
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

                BLACKLIST({ip, device, os, platform, client, end_point, date});

                LOGGER('gateway', `After 20 concurrent request within a minute, gateway blacklisted IP ${_ip} from ${_client}`);
                res.status(RESPONSE_STATUS.TOO_MANY_REQUEST.code).json({
                    success: false,
                    code: RESPONSE_STATUS.TOO_MANY_REQUEST.code,
                    msg: RESPONSE_STATUS.TOO_MANY_REQUEST.msg
                });
            }
            else
            {  
                // cache ip request to redis
                INCREMENT(_ip, 60);
                next();
            }
        })
        .catch((err:any) => {
            LOGGER('gateway', `Failed request: ${err.message}`);
            res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code).json({
                success: false,
                code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code,
                msg: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.msg
            });
        });
    }
}