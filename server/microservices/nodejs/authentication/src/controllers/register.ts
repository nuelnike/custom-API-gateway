const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
import type {Request, Response} from 'express';
import {RESPONSE_STATUS, CHECK_IF_EMPTY, CHECK_EMAIL_PATTERN, STATUS_CODE, GENERATE_TOKEN, GENERATE_UUID, GENERATE_RANDOM_INT, FUTURE_DATE_MILI_SECS} from '../../../../../engine/src/include/index';
import {ENCRYPT} from '../../../../../engine/src/security/index';
import {User, Session} from '../helpers/models';
import {SET} from '../../../../../engine/src/redis/index';
import {LOGGER} from '../../../../../engine/src/include/logger';

module.exports = (router:any) => {  
 
  //register user
  router.post("/register", (req:Request, res:Response) => { 

    const user:any = req.body;

    if ( CHECK_IF_EMPTY(user.username) || CHECK_IF_EMPTY(user.surname) || CHECK_IF_EMPTY(user.firstname) || CHECK_IF_EMPTY(user.phone) || CHECK_IF_EMPTY(user.gender) || CHECK_IF_EMPTY(user.address) || CHECK_IF_EMPTY(user.password))
    {
      res.json({ // CHECK IF ALL REQUIRED INPUT IS SET
        success: false,
        code: RESPONSE_STATUS.BAD_REQUEST.code, 
        msg: RESPONSE_STATUS.BAD_REQUEST.msg
      })
    } 

    else if (!CHECK_EMAIL_PATTERN(user.email)) 
    { // END EXECUTION IF THERE IS AN ISSUE WITH EMAIL PROVIDED 
      res.json({
        success: false,
        code: RESPONSE_STATUS.BAD_REQUEST.code,
        msg: "user email adress is invalid"
      })
    } 
    
    else if(user.password < 5) 
    { // END EXECUTION IF THERE IS AN ISSUE WITH PASSWORD PROVIDED
      res.json({
        success: false,
        code: RESPONSE_STATUS.BAD_REQUEST.code,
        msg: "password should be more than 5 characters."
      })
    } 

    else if(CHECK_IF_EMPTY(user.confirm_password)) 
    { // END EXECUTION IF THERE IS AN ISSUE WITH PASSWORD PROVIDED
      res.json({
        success: false,
        code: RESPONSE_STATUS.BAD_REQUEST.code,
        msg: "confirm password cannot be empty."
      })
    } 

    else if (user.password !== user.confirm_password)
    { // CHECK SERVER SIDE PASSWORD MATCH 
      res.json({
        success: false,
        code: RESPONSE_STATUS.BAD_REQUEST.code,
        msg: 'your login passwords don`t match, try again!'
      })
    } 

    else 
    { //CONTINUE EXECUTION IF CHECKS PASS. 
      User.findOne({ 
        where: { [Op.or]: [{email: user.email}, {username: user.username}]}  
      })
      .then((user_resp:any) => {
        if(!CHECK_IF_EMPTY(user_resp))
        { 
          res.json({
            success: false,
            code: RESPONSE_STATUS.RESOURCE_EXIST.code,
            msg: ' user email/username already exist.'
          }) 
        }
        else
        {    
          bcrypt.hash(user.password, 10, (err:any, hash:string) => { // ENCRYPT PASSWORD BEFORE USER CREATION  
            if(!CHECK_IF_EMPTY(err))
            {
              LOGGER('authentication', `Failed registration: ${err.message}`);
              res.json({
                success: false,
                code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code,
                msg: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.msg
              }) 
            }
            else
            {
              user.password = hash; 
              // user.id = GENERATE_TOKEN(16); 
              user.id = GENERATE_UUID();
              user.city_id = CHECK_IF_EMPTY(user.city_id) ? null : user.city_id;
              user.country_id = CHECK_IF_EMPTY(user.country_id) ? null : user.country_id;
              user.state_id = CHECK_IF_EMPTY(user.state_id) ? null : user.city_id;
              user.status_id = STATUS_CODE.ACTIVE;

              User.create(user) 
              .then((userNew:any) => { // AFTER USER CREATION LOG ACTIVITY & CREATE CHIEF HR RECORD 
                
                let token:string = GENERATE_TOKEN();  
                let date:any = new Date();
                let duration:number = FUTURE_DATE_MILI_SECS(date, 30);

                Session.create({
                  token: token,
                  duration: duration,
                  user_id: userNew.id,
                  status_id: STATUS_CODE.ONLINE, 
                })
                .then((sess:any) => { // Store session details in db  
                  
                  //PREPARE RESPONSE AFTER LOGIN SUCCESS ( CLIENT CACHING)  
                  userNew.token = token;
                  let encrypt:string = ENCRYPT(userNew);
                  let cached_session:any = ENCRYPT(sess);

                  SET(userNew.id+"-session", cached_session, 0, false);; // cache session for 24 hours 

                  res.json({ // Return response to front end
                    success: true, 
                    code: RESPONSE_STATUS.SUCCESS.code,
                    msg: ` Welcome, ` + userNew.surname + ' ' + userNew.firstname,
                    data: encrypt
                  }); 

                })
                .catch((err:any) => { // CATCH IF THERE IS AN INTERNAL SERVER ERROR 
                    LOGGER('authentication', `Failed registration: ${err.message}`);
                    res.json({
                      success: false,
                      code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code,
                      msg: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.msg
                    })
                });
              })
              .catch((err:any) => { // IF ERROR WAS ENCOUNTERED TRYING TO PROCESS REGISTRATION 
                console.log(err.message)
              LOGGER('authentication', `Failed registration: ${err.message}`);
              res.json({
                success: false,
                code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code,
                msg: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.msg
              })
            })
            }
          });
        }    
      }) 
      .catch((err:any) => { // IF ERROR WAS ENCOUNTERED TRYING TO PROCESS REGISTRATION
        LOGGER('authentication', `Failed registration: ${err.message}`);
        res.json({
          success: false,
          code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.code,
          msg: RESPONSE_STATUS.INTERNAL_SERVER_ERROR.msg
        })
      })
    }
    
  });

}

