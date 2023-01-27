import express from 'express';
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const useragent = require('express-useragent');
const {INIT_DB_CONNECTION} = require(`${__dirname}/../../../../engine/src/database/config/index`)
INIT_DB_CONNECTION(); //INIT DATABASE CONNECTION
const {SERVER_PORTS} = require(`${__dirname}/../../../../engine/src/app-utils/ports.ts`); // GET SERVER PORT NUMBER
const {SERVER_INSTANCE} = require(`${__dirname}/../../../../engine/src/include/instance.ts`); // GET NUMBER OF INSTANCE NEEDED FOR THIS SERVER
const { CRASH_HANDLER } = require(`${__dirname}/../../../../engine/src/error-handler/crash-exceptions.ts`) // SERVER CRASH ERROR HANDLER
const router = require('./routes.ts'); // GET API ROUTE PATHS FOR THIS SERVER
const instance = SERVER_INSTANCE('auth');
import fs  from 'fs';
// let logStream = fs.createWriteStream(__dirname + '/../../../../engine/src/logs/services/auth.log', {flags: 'a'});

var app: any = new Array(instance) 
let port:number[] = SERVER_PORTS('auth');

for(let i = 0; i < instance; i++)
{
    
    app[i] = express(); // initiate new instance of express
    app[i].use(cors());
    // app[i].use(morgan('common', {stream: logStream}));
    app[i].use(useragent.express());
    app[i].use(bodyParser.json());
    app[i].use(bodyParser.urlencoded({ extended: false }));
    app[i].use('/api/v1/auth', router);

    // app[i].use(CRASH_HANDLER); // handle all server crash errors.
    app[i].listen(port[i], () => { 
        console.log(`Authentication Server Currently Running On Port ${port[i]}`)
    });

}


