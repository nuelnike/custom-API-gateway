import fs  from 'fs';
import {IsEmpty} from '../include/index';

export function BlackList (_data:any)
{   

    let load_file = fs.readFileSync(__dirname + '/../files/blacklist.json', 'utf-8'); 

    let _file = IsEmpty(load_file) ? [] : JSON.parse(load_file);

    _file.push(_data);

    fs.writeFile(__dirname + '/../files/blacklist.json', JSON.stringify(_file, null, 1),
    (error) => {
        if (error) {
            console.log(error)
        }
    })
}