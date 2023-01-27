import {SET} from '../../../engine/src/redis/index';
import {GENERATE_TOKEN} from '../../../engine/src/include/index';

export function GENERATE_REQUEST_SESSION(session_key:string)
{ 
    let session_value:string = GENERATE_TOKEN(); // generate request session key
    SET(session_key, session_value, 5); // cache session for 5 seconds
    return session_value;
}
