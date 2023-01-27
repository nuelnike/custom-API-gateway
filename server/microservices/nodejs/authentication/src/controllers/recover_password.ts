import type {Request, Response} from 'express';
import {RESPONSE_STATUS, CHECK_IF_EMPTY, CHECK_EMAIL_PATTERN, STATUS_CODE, GENERATE_RANDOM_STRINGS} from '../../../../../engine/src/include/index';
import {ENCRYPT, DECRYPT} from '../../../../../engine/src/security/index';
import {User} from '../helpers/models';
import {SET} from '../../../../../engine/src/redis/index';
import {LOGGER} from '../../../../../engine/src/include/logger';

module.exports = (router:any) => {  
 
  //recover_password user
  router.post("/recover-password", (req:Request, res:Response) => { 

    const {email}:{email:string} = req.body;

    if (CHECK_IF_EMPTY(email) || !CHECK_EMAIL_PATTERN(email)) 
    { // END EXECUTION IF THERE IS AN ISSUE WITH EMAIL PROVIDED 
      res.json({
        success: false,
        code: RESPONSE_STATUS.BAD_REQUEST.code,
        msg: "user email address is invalid"
      })
    } 
     
    else 
    { //CONTINUE EXECUTION IF CHECKS PASS. 
        User.findOne({ 
          where: { email },
          attributes: ["id", "status_id", "surname"]
        }) // CHECK IF EMAIL EXISTS 
        .then((resp:any) => { // CONTINUE EXECUTION AFTER EMAIL PARSE
            if(!CHECK_IF_EMPTY(resp))
            { 
              if (resp.status_id === STATUS_CODE.INACTIVE)
              {
                res.json({
                  success: false,
                  code: RESPONSE_STATUS.UNAUTHORIZED.code,
                  msg: 'this account is currently inactive, kindly contact support.'
                })
              }
              else if (resp.status_id === STATUS_CODE.ACTIVE)
              { 

                let otp:string = ENCRYPT(GENERATE_RANDOM_STRINGS(4));

                SET(resp.id+"_otp", otp, 0, false); //cache otp for 30 mins  

                res.json({ // Return response to front end
                  success: true, 
                  code: RESPONSE_STATUS.SUCCESS.code,
                  data: {id:resp.id, otp: DECRYPT(otp) },
                  msg: ` Hi ` + resp.surname + ', an otp has been sent to ' + email + ' to complete this process.'
                });

              }  
            }  
            else
            {
              res.json({
                success: false,
                code: RESPONSE_STATUS.NOT_FOUND.code,
                msg: " user email address don`t exist."
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

