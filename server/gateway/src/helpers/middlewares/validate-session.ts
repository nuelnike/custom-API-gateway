import {Request, Response, NextFunction} from 'express';
import {GET} from '../../../../engine/src/redis/index';
import {ENCRYPT, DECRYPT} from '../../../../engine/src/security/index'; 
import {RESPONSE_STATUS, CHECK_IF_EMPTY} from '../../../../engine/src/include/index';
import {LOGGER} from '../../../../engine/src/include/logger';

/************************************************************************************
 * first confirm request header authorization key exists
 * then confirm auth exists in redis
 * then validate
 * then create a temporal reqest session key and value for this particular request
 * **********************************************************************************/

export function VALIDATE_SESSION(req: Request, res: Response, next:NextFunction)
{

    let session:any;
    let auth:any = req.headers?.authorization

    if(!CHECK_IF_EMPTY(auth))
    {
        const user:any = DECRYPT(auth);
        let decrypt_session:any;

        async function REDIS_SESSION() {    
            session = await GET(user.user_id+"-session");// cache instance
        }

        REDIS_SESSION() // GET INSTANCE FROM CACHE
        .then(() => {
            decrypt_session = DECRYPT(session)
            if(decrypt_session.token == user.token && decrypt_session.user_id == user.user_id) next();
            else
            {
                LOGGER('gateway', `Tried to access product routes without a valid session token.`);
                res.status(RESPONSE_STATUS.UNAUTHORIZED.code).json({
                    success: false,
                    code: RESPONSE_STATUS.UNAUTHORIZED.code,
                    msg: RESPONSE_STATUS.UNAUTHORIZED.msg
                });
            }
        })
        .catch((err:any)=>{
            LOGGER('gateway', `Session error: ${err.message}`);
            res.status(RESPONSE_STATUS.UNAUTHORIZED.code).json({
                success: false,
                code: RESPONSE_STATUS.UNAUTHORIZED.code,
                msg: RESPONSE_STATUS.UNAUTHORIZED.msg
            });
        })
    }
    else
    {
        LOGGER('gateway', `Tried to access product routes without a valid session token.`);
        res.status(RESPONSE_STATUS.UNAUTHORIZED.code).json({
            success: false,
            code: RESPONSE_STATUS.UNAUTHORIZED.code,
            msg: RESPONSE_STATUS.UNAUTHORIZED.msg
        });
    }
}