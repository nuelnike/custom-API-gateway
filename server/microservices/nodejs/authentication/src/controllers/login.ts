const bcrypt = require('bcrypt')
import type {Request, Response} from 'express';
import {RESPONSE_STATUS, CHECK_IF_EMPTY, CHECK_EMAIL_PATTERN, STATUS_CODE, GENERATE_TOKEN, FUTURE_DATE_MILI_SECS} from '../../../../../engine/src/include/index';
import {ENCRYPT} from '../../../../../engine/src/security/index';
import {User, Session} from '../helpers/models';
import {SET} from '../../../../../engine/src/redis/index';
import {LOGGER} from '../../../../../engine/src/include/logger';
const { Op } = require("sequelize");

module.exports = (router:any) => {  
 
  //login user
  router.post("/login", (req:Request, res:Response) => { 

    const {email, password, meta}: {email:string, password:string, meta:any} = req.body;

    if(CHECK_IF_EMPTY(email) || CHECK_IF_EMPTY(password))
    {
      res.json({
        success: false, 
        code: RESPONSE_STATUS.BAD_REQUEST.code,
        msg: RESPONSE_STATUS.BAD_REQUEST.msg
      }) 
    } 

    else if (!CHECK_EMAIL_PATTERN(email)) 
    { // END EXECUTION IF THERE IS AN ISSUE WITH EMAIL PROVIDED 
      res.json({
        success: false,
        code: RESPONSE_STATUS.BAD_REQUEST.code,
        msg: "user email adress is invalid"
      })
    } 
    
    else if(CHECK_IF_EMPTY(password)) 
    { // END EXECUTION IF THERE IS AN ISSUE WITH PASSWORD PROVIDED
      res.json({
        success: false,
        code: RESPONSE_STATUS.REQUEST_RESPONSE.no_password.code,
        msg: RESPONSE_STATUS.REQUEST_RESPONSE.no_password.msg
      })
    } 

    else 
    { //CONTINUE EXECUTION IF CHECKS PASS. 
        User.findOne({ 
          where: { [Op.or]: [{email: email}, {username: email}]}, 
          attributes: ["id","firstname","surname","othername","username","status_id","email","phone","address","photo","gender","password"]
        }) // CHECK IF EMAIL EXISTS 
        .then((resp:any) => { // CONTINUE EXECUTION AFTER EMAIL PARSE
            if(!CHECK_IF_EMPTY(resp))
            {
              if (bcrypt.compareSync(password, resp.password)) { // ENCRYPT AND CHECK USER PASSWORD MATCH  
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
                    let token:string = GENERATE_TOKEN(); 
                    //LOG THIS ACTIVITY 
                    let date:any = new Date(); 
                    let duration:number = FUTURE_DATE_MILI_SECS(date, 30); // session ++++++++++token expires in 7 days 

                    Session.create({ 
                      token,
                      duration,
                      user_id: resp.id,
                      status_id: STATUS_CODE.ONLINE,
                    })
                    .then((sess:any) => { // Store session details in db  
                    
                      //PREPARE RESPONSE AFTER LOGIN SUCCESS ( CLIENT CACHING)  
                      resp.token = token;
                      resp.duration = duration;
                      let encrypt:any = ENCRYPT(resp);
                      let cached_session:any = ENCRYPT(sess);

                      SET(resp.id+"-session", cached_session, 0, false); // cache session for 24 hours  

                      res.json({ // Return response to front end
                        success: true, 
                        code: RESPONSE_STATUS.SUCCESS.code,
                        msg: ` Welcome, ` + resp.surname + ' ' + resp.firstname,
                        data: encrypt,
                        token: cached_session
                      }); 

                    })
                    .catch((err:any) => { // CATCH IF THERE IS AN INTERNAL SERVER ERROR 
                        LOGGER('authentication', `Failed login: ${err.message}`);
                        res.json({
                          success: false,
                          code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code,
                          msg: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.msg
                        })
                    });
                  }   
                  else
                  { 
                    res.json({
                      success: false,
                      code: RESPONSE_STATUS.FORBIDDEN.code,
                      msg: resp.status_id === STATUS_CODE.ACTIVE
                    }) 
                  }
              }  
              else { // RESTURN RESPONSE IF PASSWORD IS WRONG.
                // LOG_ACTIVITY('authentication', resp.id+" tried to login with a wrong password.")
                res.json({
                  success: false,
                  code: RESPONSE_STATUS.BAD_REQUEST.code,
                  msg: "password is invalid, try again"
                })
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
            LOGGER('authentication', `Failed login: ${err.message}`);
            res.json({
              success: false,
              code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code,
              msg: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.msg
            })
        }); 
    }
    
  });

}

