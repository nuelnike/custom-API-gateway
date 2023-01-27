// const {RESPONSE_STATUS} = require("../include/index");
const CRASH_HANDLER = (err:any, next:any) => {
    if(err)
    { 
        return ({ 
            success: false, 
            code: 500, 
            msg: "RESPONSE_STATUS.FATAL_SERVER_ERROR.msg"
        });
    }
    else next();
}

module.exports = { CRASH_HANDLER }