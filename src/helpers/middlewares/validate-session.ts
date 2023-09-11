import {Request, Response, NextFunction} from 'express';
import {RedisGet} from '../../bootstrap/redis/index';
import {Decrypt} from '../../bootstrap/security/index'; 
import {ResponseStatus, IsEmpty} from '../../bootstrap/include/index';
import {Logger} from '../../bootstrap/include/logger';

/************************************************************************************
 * first confirm request header authorization key exists
 * then confirm auth exists in redis
 * then validate
 * then create a temporal reqest session key and value for this particular request
 * **********************************************************************************/

export function ValidateSession(req: Request, res: Response, next:NextFunction)
{

    let session:any;
    let auth:any = req.headers?.authorization

    if(!IsEmpty(auth))
    {
        const user:any = Decrypt(auth);
        let Decrypt_session:any;

        async function RedisSession() {    
            session = await RedisGet(user.user_id+"-session");// cache instance
        }

        RedisSession() // RedisGet INSTANCE FROM CACHE
        .then(() => {
            Decrypt_session = Decrypt(session)
            if(Decrypt_session.token == user.token && Decrypt_session.user_id == user.user_id) next();
            else
            {
                Logger('error', `Tried to access product routes without a valid session token.`);
                res.status(ResponseStatus.Unauthorized.code).json({
                    success: false,
                    code: ResponseStatus.Unauthorized.code,
                    msg: ResponseStatus.Unauthorized.msg
                });
            }
        })
        .catch((err:any)=>{
            Logger('error', `Session error: ${err.message}`);
            res.status(ResponseStatus.Unauthorized.code).json({
                success: false,
                code: ResponseStatus.Unauthorized.code,
                msg: ResponseStatus.Unauthorized.msg
            });
        })
    }
    else
    {
        Logger('error', `Tried to access product routes without a valid session token.`);
        res.status(ResponseStatus.Unauthorized.code).json({
            success: false,
            code: ResponseStatus.Unauthorized.code,
            msg: ResponseStatus.Unauthorized.msg
        });
    }
}