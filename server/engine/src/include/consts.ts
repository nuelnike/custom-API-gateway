import {SERVER_PORTS} from '../app-utils/ports';

export const RESPONSE_STATUS:any = 
{
    WILD_CARD:
    {
        code: 100,
        msg: 'special operation'
    },
    SUCCESS:
    {
        code: 200,
        msg: 'operation successfull'
    },
    CREATED:
    {
        code: 201,
        msg: 'new record was created successfull'
    },
    ACCEPTED:
    {
        code: 202,
        msg: 'request was recived successfully'
    },
    BAD_REQUEST:
    {
        code: 400,
        msg: 'this request is not allowed.'
    },
    UNAUTHORIZED:
    {
        code: 401,
        msg: 'you are not authorized to perform this action.'
    },
    FORBIDDEN:
    {
        code: 403,
        msg: 'you are forbidden to take this action at this time.'
    },
    NOT_FOUND:
    {
        code: 404,
        msg: 'the resource requested was not found.'
    },
    METHOD_NOT_ALLOWED:
    {
        code: 405,
        msg: 'this request method is not allowed.'
    },
    RESOURCE_EXIST:
    {
        code: 406,
        msg: 'this resource already exists.'
    },
    PAYLOAD_TOO_LARGE:
    {
        code: 413,
        msg: 'request payload is too heavy.'
    },
    INTERNAL_SERVER_ERROR:
    {
        code: 500,
        msg: 'encountered an internal server error.'
    },
    BAD_GATEWAY:
    {
        code: 502,
        msg: 'bad gateway error encountered.'
    },
    SERVICE_UNAVAILABLE:
    {
        code: 503,
        msg: 'this service requested is currently unavailable.'
    },
    GATEWAY_TIMEOUT:
    {
        code: 504,
        msg: 'server timeout error occured.'
    },
    TOO_MANY_REQUEST:
    {
        code: 429,
        msg: 'too many request.'
    },
}

export const LIVE_ENV:boolean = false;

export function IP(typ:string)
{
    let ip: string;
    switch (typ) { // switch to define perfect api n

        case 'auth': // Authentication server instances running on multiple n
            ip = !LIVE_ENV ? `http://localhost` : `http://143.198.138.103`;
            break; 
        case 'product': // Authentication server instances running on multiple n
            ip = !LIVE_ENV ? `http://localhost` : `http://143.198.138.103`;
            break; 
        case 'order':
            ip = !LIVE_ENV ? `http://localhost` : `http://143.198.138.103`;
            break; 
        case 'tracker':
            ip = !LIVE_ENV ? `http://localhost` : `http://143.198.138.103`;
            break;

        default: ip = !LIVE_ENV ? `http://localhost` : `http://143.198.138.103`;
    }

    return ip;
}

export const STATUS_CODE:any = 
{
    ACTIVE: 1,
    INACTIVE: 2,
    NEW: 3,
    SEEN: 4,
    ONLINE: 5,
    OFFLINE: 6,
    RESIGN: 7,
    RETIRE: 8,
    TERMINATE: 9,
    ONLEAVE: 10,
    UNAPPROVE: 11,
    UNBOARDED: 12,
    UNPROFILED: 13,
    ONBOARDING: 14,
    SUSPEND: 15,
    LOCK: 16,
    UNVERIFIED: 17,
    VERIFIED: 18,
    CONFIRMED: 19,
    UNCONFIRMED: 20, 
    REJECTED: 21, 
    UNPROCESSED: 22,
    APPROVED: 23,
    REVOKED: 24,
    EXPIRED: 25,
    SELF_PROFILING: 26,
    SELF_PROFILED: 27
}

export function SERVER_PATH(typ:string)
{
    let path: string;
    switch (typ) { // switch to define perfect api n

        case 'auth': // Authentication server instances running on multiple n
            path = "/api/v1/auth/";
            break; 
        case 'product': // Authentication server instances running on multiple n
            path = "/api/v1/product/";
            break; 
        case 'order':
            path = "/api/v1/order/";
            break;  
        case 'tracker':
            path = "/api/v1/tracker/";
            break; 

        default: path = "/api/v1/auth/";
    }
    return path;
}