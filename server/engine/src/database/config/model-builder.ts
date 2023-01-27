import {DB_CONNECTION} from './index';
module.exports = (_model:string) => { 

    const model_path = `${__dirname}/../models`; 
 
    try {   
        const MODEL_BUILDER = require(model_path+'/'+_model) // load required model  
        return DB_CONNECTION.sequelize.define( MODEL_BUILDER(_model).tbl, MODEL_BUILDER(_model).structure, MODEL_BUILDER(_model).spec ); // connect to db table.
    } 
    catch (err:any) {
      console.error(err)
    }
    
}