import axios from 'axios';
import type {Request, Response, NextFunction} from 'express';
import fs  from 'fs';

import {SERVER_INSTANCE} from '../../../engine/src/include/instance'; // GET NUMBER OF INSTANCE NEEDED FOR THIS SERVER
import {SERVER_PORTS} from '../../../engine/src/app-utils/ports';
import {LOAD_BALANCE} from '../../../engine/src/include/load_balancer';
import {GET, SET} from '../../../engine/src/redis/index';
import {RESPONSE_STATUS, CHECK_IF_EMPTY} from '../../../engine/src/include/index';
import {LOGGER} from '../../../engine/src/include/logger';
import {ENCRYPT} from '../../../engine/src/security/index';
import {VALIDATE_SESSION} from '../helpers/middlewares/validate-session';
import {VALIDATE_IP} from '../helpers/middlewares/validate-ip';

module.exports = (router:any) => {
    router.all("/auth/:api_path", (req: Request, res: Response) => {

        let cache_instance:number = 0;
        async function GET_SERVICE_INSTANCE() {    
            cache_instance = await GET("auth_instance");// cache instance for 10 mins 
        }

        GET_SERVICE_INSTANCE() // GET INSTANCE FROM CACHE
        .then(() => {

            let i:any = 0;

            if(Number(cache_instance) < SERVER_INSTANCE('auth'))
            {
                i = Number(cache_instance) ?? 0;
                SET("auth_instance", i+1, 300, false); 
            }
            else 
            {
                i = 0;
                SET("auth_instance", i+1, 300, false); 
            }
            
            const API = axios.create({
            timeout: 1000,
            headers: {
                        "Api-Key": "main-api-gateway",
                        "Token": "jhkhjkklkjlj",
                        "Access-Control-Allow-Origin": "*"
                    }
            });
            
            // if incase gateway has to reinitiate request if previous times out
            const RETRY_CALL = (x:number) =>
            {
                
                let path:string = req.params.api_path; 
                let payload:string[] = req.body;
                let method:string = req.method;

                API({ //dispatch to authentication route
                    method: method,
                    url: LOAD_BALANCE("auth", "auth", i)+"/"+path, 
                    data: payload
                })
                .then((resp:any) => { 
                    res.status(resp.status).send(resp.data); 
                })
                .catch((err:any) => { 

                    let _timeout:string = err.message; // parse error message
                    let check_to:boolean = _timeout.includes("timeout"); // check if it was cause of request timeout

                    if(check_to && x <= 3) RETRY_CALL(x+1); // reinitiate call if it was timeout
                    else // else send error response to client
                    {
                        LOGGER('gateway', `Failed request: request timeouted after three tries.`);
                        res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code).json({
                            success: false,
                            code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code,
                            msg: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.msg
                        });  
                    }

                });
            }
            RETRY_CALL(1)

        })
        .catch((err:any) => {
            LOGGER('gateway', `Failed request: ${err.message}`);
            res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code).json({
                success: false,
                code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code,
                msg: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.msg
            });
        });
    });
}