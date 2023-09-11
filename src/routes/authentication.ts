import axios from 'axios';
import type {Request, Response, NextFunction} from 'express';

import {ServerInstance} from '../bootstrap/include/instance'; // RedisGet NUMBER OF INSTANCE NEEDED FOR THIS SERVER
import {LoadBalancer} from '../bootstrap/include/load_balancer';
import {RedisGet, RedisSet} from '../bootstrap/redis/index';
import {ResponseStatus} from '../bootstrap/include/index';
import {Logger} from '../bootstrap/include/logger';
import {ValidateIP} from '../helpers/middlewares/validate-ip';

module.exports = (router:any) => {
    router.all("/auth/:api_path", ValidateIP, (req: Request, res: Response) => {

        try {
            (async () => {

                let instance:number = Number(await RedisGet("auth_instance")) ?? 0;// get authentication instance from redis or assign 0
                let timeout:number = 60000;// timeout after 1 mins 

                if(instance < ServerInstance('auth')) RedisSet("auth_instance", `${instance+1}`, 300, false); // update instace on redis

                else if(instance == ServerInstance('auth')) RedisSet("auth_instance", '0', 300, false); // reset to zero
            
                const API = axios.create({
                                timeout,
                                headers: {
                                            "Api-Key": "api-gateway",
                                            "Token": "jhkhjkklkjlj",
                                            "Access-Control-Allow-Origin": "*"
                                        }
                            });
                
                // if incase gateway has to reinitiate request if previous times out
                const RetryReqCall = async (x:number) =>
                {
                    let path:string = req.params.api_path;
                    let payload:string[] = req.body;
                    let method:string = req.method;

                    try {
                        let result:any =    await API({
                                                method: method,
                                                url: LoadBalancer("auth", instance)+"/"+path, 
                                                data: payload
                                            });
                        res.json(result.data);
                    } 
                    catch (err:any) {
                         
                        let err_message:string = err.message; // parse error message
                        let check_if_timeout:boolean = err_message.includes("timeout"); // check if it was cause of request timeout

                            if(!check_if_timeout) {
                                Logger('error', `Failed request: authentication microservice error -  ${err.message}`);
                                res.status(ResponseStatus.InternalServerErr.code).json({
                                    success: false,
                                    code: ResponseStatus.InternalServerErr.code,
                                    msg: ResponseStatus.InternalServerErr.msg
                                });  
                            }
                            else if(check_if_timeout && x <= 3) RetryReqCall(x+1); // reinitiate call if it request timedout
                            else // else send error response to client
                            {
                                Logger('error', `Failed request: request timed out after three tries(${(x * timeout)/60000} mins.)`);
                                res.status(ResponseStatus.GatewayTimeout.code).json({
                                    success: false,
                                    code: ResponseStatus.GatewayTimeout.code,
                                    msg: ResponseStatus.GatewayTimeout.msg
                                });  
                            }

                    }
                }
                RetryReqCall(1)
            })();

        } 
        catch (err:any) {
            Logger('error', `Failed request: api gateway error: ${err.message}`);
            res.status(ResponseStatus.InternalServerErr.code).json({
                success: false,
                code: ResponseStatus.InternalServerErr.code,
                msg: ResponseStatus.InternalServerErr.msg
            });
        }
    });
}