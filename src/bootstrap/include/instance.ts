export function ServerInstance(typ:string)
{
    let n: number;
    switch (typ) { // switch to define perfect api n

        case 'auth': // Authentication server instances running on multiple n
            n = 3;
            break; 
        case 'golang': // Authentication server instances running on multiple n
            n = 1;
            break; 
        case 'gateway':
            n = 3;
            break; 

        default: n = 1;
    }
    return n;
}