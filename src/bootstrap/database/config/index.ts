const Sequelize = require('sequelize');

export const DB_CONNECTION:any = {};
 
export const CONFIG:any = {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "2580",
    database: "main_gbdb",
    dialect: "postgres",
    max: 100,
    min: 0,
    acquire: 100 * 1000,
    idle: 200000
}

export function INIT_DB_CONNECTION() 
{
     
    const sequelize = new Sequelize(CONFIG.database, CONFIG.user, CONFIG.password, 
    {
        host: CONFIG.host,
        dialect: CONFIG.dialect,
        operatorAliases: false, 
        define:
        {
            timestamps: false,
            freezeTableName: true
        },
        pool:
        {
            max: CONFIG.max,
            min:CONFIG.min,
            acquire: CONFIG.acquire,
            idle: CONFIG.idle,
        }
    });

    DB_CONNECTION.sequelize = sequelize;
    return sequelize;
}