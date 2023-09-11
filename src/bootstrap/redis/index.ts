//RedisSet REDIS CACHE
const redis = require('redis');
const port:number = 6379;
const password:string = "2580";
const host:string = "127.0.0.1";

const client = redis.createClient({ port, password, host }); 
client.connect(); 


export async function Increment (val: string, time: number, expire:boolean = true) 
{
    await client.incr(val)
    .then(() => {
        if(expire) Expiry(val, time); // init cache lifespan if key needs to expire.
        return true; // return resp
    })
    .catch(() => {
        return false;
    }); 
}

export async function RedisSet (key:string, val:string, time:number, expire:boolean = true) 
{
    await client.set(key, (typeof val === 'object') ? JSON.stringify(val) : val)
    .then(() => {
        if(expire) Expiry(key, time); // init cache lifespan if key needs to expire.
        return true; // return resp
    })
    .catch(() => {
        return false;
    }); 
}

export async function RedisGet (key:string) 
{
    let res:any;
    await client.get(key)
    .then((result:any) => { 
        if(result === null) res = null;
        else if(result.includes('/')) res = JSON.parse(result);
        else res = result;
    })
    .catch((err:any) => {
        res = err.message;
    });  

    return res; 
}

export async function UnSet(key:string){ 
    let res:any = await client.del(key); 
    return res;
}

export async function Expiry(key:string, time:number = 300){
    let res:any = client.expire(key, time);
    return res;
}



// module.exports = { RedisSet, UnSet, RedisGet, Expiry }