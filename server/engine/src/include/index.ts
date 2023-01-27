export const RESPONSE_STATUS:any = {
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

export function CHECK_IF_EMPTY(v:any)
{
    let type = typeof v;
    if (type === 'undefined') {
        return true;
    }
    if (type === 'boolean') {
        return !v;
    }
    if (v === null) {
        return true;
    }
    if (v === undefined) {
        return true;
    }
    if (v instanceof Array) {
        if (v.length < 1) {
            return true;
        }
    } else if (type === 'string') {
        if (v.length < 1) {
            return true;
        }
        if (v === '0') {
            return true;
        }
    } else if (type === 'object') {
        if (Object.keys(v).length < 1) {
            return true;
        }
    } else if (type === 'number') {
        if (v === 0) {
            return true;
        }
    }
    return false;
}

export function CHECK_EMAIL_PATTERN(email:string) 
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export const SERVER_STATE:string = "dev";

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

export function GENERATE_RANDOM_STRINGS(length:number) 
{
    const strings:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return [...Array(length)].reduce(a=>a+strings[~~(Math.random()*strings.length)],'');
}


export function GENERATE_UUID() 
{   
   // return Math.random().toString(36).substring(2, 10) +"-"+ 
   // Math.random().toString(36).substring(2, 8) +"-"+ 
   // Math.random().toString(36).substring(2, 8) +"-"+ 
   // Math.random().toString(36).substring(2, 8) +"-"+ 
   // Date.now();

    function GEN(length:number) 
    {
        const strings:string = "abcdefghijklmnopqrstuvwxyz0123456789";
        return [...Array(length)].reduce(a=>a+strings[~~(Math.random()*strings.length)],'');
    }

    return GEN(8) +"-"+ GEN(8) +"-"+ Date.now().toString(36) +"-"+GEN(8)
}


export function GENERATE_TOKEN() 
{   
   return Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
}

export function GENERATE_RANDOM_INT(length:number)
{
    return (+new Date * Math.random()).toString(36).substring(0,length) 
}

export function FUTURE_DATE_MILI_SECS(date:any, days:any)
{ 
    return date.setDate(date.getDate() + Number(days));
}