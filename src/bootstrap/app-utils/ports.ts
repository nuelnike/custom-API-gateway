export function ServerPorts(typ: string)
{ 
    let port:any;

    switch (typ) { // switch to define perfect api port

        case "gateway": // if request is for mobile gateway
            port = [9000, 9001, 9002, 9003, 9004, 9005, 9006, 9007, 9008, 9009, 9010];
            break;

        case "auth": // Authentication server instances running on multiple port
            port = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010];
            break;

        case "user": // Authentication server instances running on multiple port
            port = [3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010];
            break;

        default: port = [10000];
    }

    return port;
}