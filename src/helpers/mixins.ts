import {RedisSet} from '../bootstrap/redis/index';
import {GenerateToken} from '../bootstrap/include/index';

export function GenerateReqSession(session_key:string)
{ 
    let session_value:string = GenerateToken(); // generate request session key
    RedisSet(session_key, session_value, 5); // cache session for 5 seconds
    return session_value;
}
