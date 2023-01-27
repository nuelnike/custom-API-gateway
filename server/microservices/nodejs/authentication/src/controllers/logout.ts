import type {Request, Response} from 'express';
import {RESPONSE_STATUS, CHECK_IF_EMPTY, STATUS_CODE } from '../../../../../engine/src/include/index';
import {DECRYPT} from '../../../../../engine/src/security/index';
import {Session} from '../helpers/models';
import {UNSET} from '../../../../../engine/src/redis/index';
import {LOGGER} from '../../../../../engine/src/include/logger';

module.exports = (router:any) => {  
 
  //logout user
  router.post("/logout", (req:Request, res:Response) => { 

    const {id, token}: {id:string, token:string} = req.body;


    if(CHECK_IF_EMPTY(id) || CHECK_IF_EMPTY(token))
    {
      res.json({
        success: false, 
        code: RESPONSE_STATUS.BAD_REQUEST.code,
        msg: RESPONSE_STATUS.BAD_REQUEST.msg
      }) 
    } 

    else 
    { //CONTINUE EXECUTION IF CHECKS PASS. 
        Session.destroy({ where: { user_id: id } }) 
        .then((resp:any) => { // CONTINUE EXECUTION AFTER EMAIL PARSE
            if(!CHECK_IF_EMPTY(resp))
            {  
              // UNSET(id+"-session"); // cache session for 24 hours  
              res.json({ // Return response to front end
                success: true, 
                code: RESPONSE_STATUS.SUCCESS.code,
                msg: `user logout was successfull.`
              });
            }
            else
            {
              res.json({
                success: false,
                code: RESPONSE_STATUS.NOT_FOUND.code,
                msg: "user session don`t exist."
              });
            }
        })
        .catch((err:any) => { // CATCH IF THERE IS AN INTERNAL SERVER ERROR 
            LOGGER('authentication', `Failed logout: ${err.message}`);
            res.json({
              success: false,
              code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code,
              msg: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.msg
            })
        }); 
    }
    
  });

}

