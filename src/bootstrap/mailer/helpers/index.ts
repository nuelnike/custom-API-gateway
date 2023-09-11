import fs  from 'fs';
module.exports = (typ:string, payload:any) => { 

    let email_path:string = `${__dirname}/../templates/`; // CONTTROLLER PATH

    //AUTH API UTILS   
    fs.readdirSync(email_path).forEach(name => {

        let findFileExt:string = name.indexOf('.'); // find .js extention
        let emailFile:string = name.substring(0, findFileExt); // remove .js from filename 

        if(typ === emailFile){   
            let TEMPLATE = require(`${__dirname}../templates/${name}`);
            return TEMPLATE(payload);
        }
    });
    
} 