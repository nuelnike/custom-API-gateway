import {ServerPorts} from '../app-utils/ports';
import {IP, ServerPath} from './consts';

export const LoadBalancer = (service:string, i:number) => {
    return IP(service) + ':'+ServerPorts(service)[i]+ServerPath(service);
}