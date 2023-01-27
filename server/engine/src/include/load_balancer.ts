import {SERVER_PORTS} from '../app-utils/ports';
import {IP, SERVER_PATH} from './consts';

export function LOAD_BALANCE(service:string, typ:string, i:number)
{
    return IP(service) + ':'+SERVER_PORTS(typ)[i]+SERVER_PATH(service);
}