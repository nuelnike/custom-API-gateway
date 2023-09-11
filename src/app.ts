import express, {Application} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import useragent from 'express-useragent';
import helmet from 'helmet';
// const morgan = require('morgan'); 
const {ServerPorts} = require(`${__dirname}/bootstrap/app-utils/ports.ts`);
const { CrashHandler } = require(`${__dirname}/bootstrap/error-handler/crash-exceptions.ts`) // SERVER CRASH ERROR HANDLER
const {ServerInstance} = require(`${__dirname}/bootstrap/include/instance.ts`); // RedisGet NUMBER OF INSTANCE NEEDED FOR THIS SERVER
const instance = ServerInstance('gateway');

// const {INIT_DB_CONNECTION} = require(`${__dirname}/../../bootstrap/database/config/index`)
// INIT_DB_CONNECTION(); //INIT DATABASE CONNECTION

const router = require('./routes/index.ts');
// const router = require('./routes.js')

var app:any = new Array(instance) 
let port:any = ServerPorts('gateway');

for(let i = 0; i < instance; i++)
{
    
    app[i] = express(); // initiate new instance of express
    app[i].use(cors());
    app[i].use(helmet());
    // app[i].use(morgan('combined'));
    app[i].use(useragent.express());
    app[i].use(bodyParser.json());
    app[i].use(bodyParser.urlencoded({ extended: false }));
    app[i].use('/', router);

    app[i].use(CrashHandler); // handle all server crash errors.

    app[i].listen(port[i], () => {   
        console.log(`Custom API Gateway Currently Running On Port ${port[i]}`);
    });

}