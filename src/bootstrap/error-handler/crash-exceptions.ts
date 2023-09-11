// const {ResponseStatus} = require("../include/index");
const CrashHandler = (err:any, next:any) => {
    if(err)
    { 
        return ({ 
            success: false, 
            code: 500, 
            msg: "ResponseStatus.FATAL_SERVER_ERROR.msg"
        });
    }
    else next();
}

module.exports = { CrashHandler }