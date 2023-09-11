import axios from 'axios';
import type {Request, Response, NextFunction} from 'express';

import {ServerInstance} from '../bootstrap/include/instance'; // RedisGet NUMBER OF INSTANCE NEEDED FOR THIS SERVER
import {LoadBalancer} from '../bootstrap/include/load_balancer';
import {RedisGet, RedisSet} from '../bootstrap/redis/index';
import {ResponseStatus, IsEmpty} from '../bootstrap/include/index';
import {Logger} from '../bootstrap/include/logger';
import {ValidateIP} from '../helpers/middlewares/validate-ip';
import {ValidateSession} from '../helpers/middlewares/validate-session';
import {Decrypt} from '../bootstrap/security/index';
import {GenerateReqSession} from '../helpers/mixins';

module.exports = (router:any) => {
    router.all("/user/:api_path", ValidateIP, ValidateSession, (req: Request, res: Response) => {
        

        try {
            (async () => {
                
                let qry:string = ""; // define params variable
                let instance:number = Number(await RedisGet("user_instance")) ?? 0;// get userentication instance from redis or assign 0
                let timeout:number = 60000;// timeout after 1 mins
                let auth:any = req.headers?.authorization
                const user:any = Decrypt(auth);
                let counter:number = 0; // define index for keys array
                
                //check if params is not empty
                if(!IsEmpty(req.query))
                { 
                    const arrs = Object.keys(req.query); // RedisGet all params keys
                    let i:number = 0; // define index for keys array
                    for (const arr of arrs) { // itrate keys
                        let ist:string = (i == 0) ? '?' : '&'; // check if key is first then add ? else add & to params path
                        qry += ist+arr+'='+req.query[arrs[i]] // concat each params key
                        i++; //increment index
                    }

                }
                console.log(qry)

                let api_path:any = req.params.api_path ?? '';
                let params:any = IsEmpty(req.query) ? api_path : api_path+qry;
                let path:string = LoadBalancer("user", counter)+params.replace("/?", "?");
                let session_key:string = user.user_id+"-"+LoadBalancer("user", counter)+api_path; // generate request session key 
                let token:string = GenerateReqSession(session_key);

                if(instance < ServerInstance('user')) RedisSet("user_instance", `${instance+1}`, 300, false); // update instace on redis

                else if(instance == ServerInstance('user')) RedisSet("user_instance", '0', 300, false); // reset to zero
            
                const API = axios.create({
                                timeout,
                                headers: {
                                            "Api-Key": "api-gateway",
                                            "Access-Control-Allow-Origin": "*",
                                            "Token": token,
                                            "User": user?.user_id,
                                        }
                            });
                
                // if incase gateway has to reinitiate request if previous times out
                const RetryReqCall = async (x:number) =>
                { 

                    try {

                        let result:any =    await API({
                                                method: req.method,
                                                url: path, 
                                                data: req.body
                                            });

                        res.json(result.data);

                    } 
                    catch (err:any) {
                         
                        let err_message:string = err.message; // parse error message
                        let check_if_timeout:boolean = err_message.includes("timeout"); // check if it was cause of request timeout

                        if(!check_if_timeout) {
                            Logger('error', `Failed request: user microservice error: ${err.message}`);
                            res.status(ResponseStatus.InternalServerErr.code).json({
                                success: false,
                                code: ResponseStatus.InternalServerErr.code,
                                msg: ResponseStatus.InternalServerErr.msg
                            });  
                        }
                        else if(check_if_timeout && x <= 3) RetryReqCall(x+1); // reinitiate call if it request timedout
                        else // else send error response to client
                        {
                            Logger('error', `Failed request: api gateway error: ${err.message}`);
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
            Logger('error', `Failed request: ${err.message}`);
            res.status(ResponseStatus.InternalServerErr.code).json({
                success: false,
                code: ResponseStatus.InternalServerErr.code,
                msg: ResponseStatus.InternalServerErr.msg
            });
        }
    });
}