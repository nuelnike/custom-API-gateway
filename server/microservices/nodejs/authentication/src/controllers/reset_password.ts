const bcrypt = require('bcrypt')
import type {Request, Response} from 'express';
import {RESPONSE_STATUS, CHECK_IF_EMPTY, STATUS_CODE, FUTURE_DATE_MILI_SECS, GENERATE_TOKEN} from '../../../../../engine/src/include/index';
import {ENCRYPT} from '../../../../../engine/src/security/index';
import {User, Session} from '../helpers/models';
import {SET, GET, UNSET} from '../../../../../engine/src/redis/index';
import {LOGGER} from '../../../../../engine/src/include/logger';

module.exports = (router:any) => {  
 
  //recover_password user
  router.post("/reset-password", (req:Request, res:Response) => { 

    const {otp, id, password, confirm_password}:{otp:string, id:string, password:string, confirm_password:string} = req.body;

    if(CHECK_IF_EMPTY(otp) || CHECK_IF_EMPTY(id))
    {
      res.json({
        success: false, 
        code: RESPONSE_STATUS.BAD_REQUEST.code,
        msg: RESPONSE_STATUS.BAD_REQUEST.msg
      }) 
    } 

    else if(password.length < 5) 
    { // END EXECUTION IF THERE IS AN ISSUE WITH PASSWORD PROVIDED
      res.json({
        success: false,
        code: RESPONSE_STATUS.BAD_REQUEST.code,
        msg: "password should be more than 5 characters."
      })
    } 

    else if(CHECK_IF_EMPTY(confirm_password)) 
    { // END EXECUTION IF THERE IS AN ISSUE WITH PASSWORD PROVIDED
      res.json({
        success: false,
        code: RESPONSE_STATUS.BAD_REQUEST.code,
        msg: "confirm password cannot be empty."
      })
    } 

    else if (password !== confirm_password)
    { // CHECK SERVER SIDE PASSWORD MATCH 
      res.json({
        success: false,
        code: RESPONSE_STATUS.BAD_REQUEST.code,
        msg: 'your login passwords don`t match, try again!'
      })
    } 
     
    else 
    { 
      User.findOne({ 
        where: { id }
      }) // CHECK IF EMAIL EXISTS 
      .then((resp:any) => { // CONTINUE EXECUTION AFTER EMAIL PARSE
          if(!CHECK_IF_EMPTY(resp))
          { 

            let cache_otp:string;
            async function GET_OTP() {    
                cache_otp = await GET(`${id}_otp`);// cache otp from redis
            }

              GET_OTP() // GET INSTANCE FROM CACHE
              .then(() => {
                if(!CHECK_IF_EMPTY(cache_otp))
                {
                  bcrypt.hash(password, 10, (err:any, hash:string) => { // ENCRYPT PASSWORD BEFORE USER CREATION  
                    if(!CHECK_IF_EMPTY(err))
                    {
                      LOGGER('authentication', `Failed password reset: ${err.message}`);
                      res.json({
                        success: false,
                        code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code,
                        msg: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.msg
                      }) 
                    }
                    else
                    {
                      User.update({password: hash}, { where: {id} })
                      .then(() => {
                        
                        let token:string = GENERATE_TOKEN();
                        const date:any = new Date();
                        const duration:number = FUTURE_DATE_MILI_SECS(date, 30); // session ++++++++++token expires in 7 days
                        
                        // Session.destroy({ where: { user_id: resp.id } })

                        Session.create({
                            token,
                            duration,
                            user_id: id,
                            status_id: STATUS_CODE.ONLINE, 
                        })
                        .then((sess:any) => { // Store session details in db  
                          
                          //PREPARE RESPONSE AFTER LOGIN SUCCESS ( CLIENT CACHING)  
                          resp.token = token;
                          let encrypt:string = ENCRYPT(resp);
                          let cached_session:any = ENCRYPT(sess);

                          SET(id+"-session", cached_session, 0, false); // cache session for 24 hours  

                          UNSET(id+"_otp"); //cache otp for 30 mins

                          res.json({ // Return response to front end
                            success: true, 
                            code: RESPONSE_STATUS.SUCCESS.code,
                            msg: ` Password reset was successfull.`,
                            data: encrypt
                          }); 

                        })
                        .catch((err:any) => { // CATCH IF THERE IS AN INTERNAL SERVER ERROR 
                          LOGGER('authentication', `Failed password reset: ${err.message}`);
                          res.json({
                            success: false,
                            code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code,
                            msg: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.msg
                          })
                        }); 
                      })
                      .catch((err:any) => { // CATCH IF THERE IS AN INTERNAL SERVER ERROR 
                        LOGGER('authentication', `Failed password reset: ${err.message}`);
                        res.json({
                          success: false,
                          code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code,
                          msg: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.msg
                        })
                      }); 
                    }
                  })
                }
                else{
                  res.json({
                    success: false,
                    code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code,
                    msg: "OTP validation failed, try again."
                  });
                }
              })
              .catch(()=> {
                res.json({
                  success: false,
                  code: RESPONSE_STATUS.NOT_FOUND.code,
                  msg: " OTP is invalid, try again."
                });
              })

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
          LOGGER('authentication', `Failed password reset: ${err.message}`);
          res.json({
            success: false,
            code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code,
            msg: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.msg
          })
      }); 
    }
    
  });

}

