import {ServerPorts} from '../app-utils/ports';

export const ResponseStatus:any = 
{
    WildCard:
    {
        code: 100,
        msg: 'special operation'
    },
    Success:
    {
        code: 200,
        msg: 'operation successfull'
    },
    Created:
    {
        code: 201,
        msg: 'new record was created successfull'
    },
    Accepted:
    {
        code: 202,
        msg: 'request was recived successfully'
    },
    BadRequest:
    {
        code: 400,
        msg: 'this request is not allowed.'
    },
    Unauthorized:
    {
        code: 401,
        msg: 'you are not authorized to perform this action.'
    },
    Forbidden:
    {
        code: 403,
        msg: 'you are forbidden to take this action at this time.'
    },
    NotFound:
    {
        code: 404,
        msg: 'the resource requested was not found.'
    },
    MethodNotAllowed:
    {
        code: 405,
        msg: 'this request method is not allowed.'
    },
    ResourceExist:
    {
        code: 406,
        msg: 'this resource already exists.'
    },
    PayloadTooLarge:
    {
        code: 413,
        msg: 'request payload is too heavy.'
    },
    InternalServerErr:
    {
        code: 500,
        msg: 'encountered an internal server error.'
    },
    BadGateway:
    {
        code: 502,
        msg: 'bad gateway error encountered.'
    },
    ServiceUnavailable:
    {
        code: 503,
        msg: 'this service requested is currently unavailable.'
    },
    GatewayTimeout:
    {
        code: 504,
        msg: 'server timeout error occured.'
    },
    TooManyRequest:
    {
        code: 429,
        msg: 'too many request.'
    },
}

export const IsLive:boolean = false;

export const IP = (typ:string) =>
{
    switch (typ) { // switch to define perfect api n

        case 'auth': // Authentication server instances running on multiple n
            return !IsLive ? `http://localhost` : `http://143.198.138.103`; 

        case 'user': // Authentication server instances running on multiple n
            return !IsLive ? `http://localhost` : `http://143.198.138.103`; 

        default: return !IsLive ? `http://localhost` : `http://143.198.138.103`;
    }
}

export const StatusCode:any = 
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

export function ServerPath(typ:string)
{ 
    switch (typ) { // switch to define perfect api n
        case 'auth': // Authentication server instances running on multiple n
            return "/api/v1/auth";
            
        case 'user': // Authentication server instances running on multiple n
            return "/api/v1/user"; 

        default: return "/api/v1/auth/";
    }
}