import axios from 'axios';
import type {Request, Response, NextFunction} from 'express';
import fs  from 'fs';

import {SERVER_INSTANCE} from '../../../engine/src/include/instance'; // GET NUMBER OF INSTANCE NEEDED FOR THIS SERVER
import {SERVER_PORTS} from '../../../engine/src/app-utils/ports';
import {LOAD_BALANCE} from '../../../engine/src/include/load_balancer';
import {GET, SET} from '../../../engine/src/redis/index';
import {RESPONSE_STATUS, CHECK_IF_EMPTY} from '../../../engine/src/include/index';
import {LOGGER} from '../../../engine/src/include/logger';
import {ENCRYPT, DECRYPT} from '../../../engine/src/security/index';
import {VALIDATE_SESSION} from '../helpers/middlewares/validate-session';
import {VALIDATE_IP} from '../helpers/middlewares/validate-ip';
import {GENERATE_REQUEST_SESSION} from '../helpers/mixins';

module.exports = (router:any) => {  
    router.all("/product/:api_path?", VALIDATE_SESSION, (req: Request, res: Response) => {

        let cache_instance:number = 0;
        async function GET_SERVICE_INSTANCE() {    
            cache_instance = await GET("go_instance");// cache instance for 10 mins 
        }

        GET_SERVICE_INSTANCE() // GET INSTANCE FROM CACHE
        .then(() => {

            let i:any = 0;

            if(Number(cache_instance) < SERVER_INSTANCE('golang'))
            {
                i = Number(cache_instance) ?? 0;
                SET("go_instance", i+1, 300, false); 
            }
            else 
            {
                i = 0;
                SET("go_instance", i+1, 300, false); 
            } 

            let qurey:any = ''; // define params variable

            //check if params is not empty
            if(!CHECK_IF_EMPTY(req.query))
            { 
                const arrs = Object.keys(req.query); // get all params keys
                let i:number = 0; // define index for keys array
                for (const arr of arrs) { // itrate keys
                    let _ist:string = i == 0 ? '?' : '&'; // check if key is first then add ? else add & to params path
                    qurey += _ist+arr+'='+req.query[arrs[i]] // concat each params key
                    i++; //increment index
                }

            }

            let auth:any = req.headers?.authorization
            const user:any = DECRYPT(auth);

            let api_path:any = req.params.api_path ?? '';
            let params:any = CHECK_IF_EMPTY(req.query) ? api_path : api_path+qurey;
            let path:string = LOAD_BALANCE("product", "golang", i)+params.replace("/?", "?");
            let session_key:string = user.user_id+"-"+LOAD_BALANCE("product", "golang", i)+api_path; // generate request session key 
            let token:string = GENERATE_REQUEST_SESSION(session_key);
            
            const API = axios.create({
            timeout: 1000,
            headers: {
                        "Api-Key": "main-api-gateway",
                        "Token": token,
                        "User": user.user_id,
                        "Access-Control-Allow-Origin": "*"
                    }
            });
            
            // if incase gateway has to reinitiate request if previous times out
            const RETRY_CALL = (x:number) =>
            {  
                API({ //dispatch to authentication route
                    method: req.method,
                    url: path,
                    data: req.body
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
                        LOGGER('gateway', `Failed request: ${err.message}`);
                        res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code)
                        .json({
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
            res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code)
            .json({
                success: false,
                code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code,
                msg: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.msg
            });
        });
    });
}