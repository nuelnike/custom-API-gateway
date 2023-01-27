import fs  from 'fs';
import {CHECK_IF_EMPTY} from '../include/index';

export function BLACKLIST (_data:any)
{   

    let load_file = fs.readFileSync(__dirname + '/../files/blacklist.json', 'utf-8'); 

    let _file = CHECK_IF_EMPTY(load_file) ? [] : JSON.parse(load_file);

    _file.push(_data);

    fs.writeFile(__dirname + '/../files/blacklist.json', JSON.stringify(_file, null, 1),
    (error) => {
        if (error) {
            console.log(error)
        }
    })
}