import fs  from 'fs';
export function LOGGER (resource:string, message:string)
{
    fs.appendFile(__dirname + '/../logs/'+resource+'.log',
    message + ' on ' + new Date(Date.now()) + '\n',
    (error) => {
        if (error) {
            console.log(error)
        }
    })
}