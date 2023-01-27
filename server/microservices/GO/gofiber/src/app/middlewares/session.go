package middleware

import (
	cache "gofiber/src/app/utility/cache"
	"github.com/gofiber/fiber/v2"
)

//Session func checks if a user's token is valid
func Session(c *fiber.Ctx) error { 
	
	var api_key string 
	var host 	string
	var uid		string
	var token	string
 
	headers := c.GetReqHeaders();
	for key, val := range headers {
		switch key {
			case "Api-Key":
				api_key = val;
			case "Host":
				host = val;
			case "User":
				uid = val;
			case "Token":
				token = val;
		}
	}

	if(api_key != "main-api-gateway" || host != "localhost:3000"){
		return c.JSON(fiber.Map{"success": false, "code": 403, "message": "this action is forbidden"})
	}else{
		reQuestURL := c.BaseURL()+c.Path(); // get request path
		key := uid+"-"+reQuestURL; // generate request session key
		reqSes, _ := cache.GetCache(key) // get request session key

		if(token == reqSes){
			cache.DelCache(key) // delete request session key 
			return c.Next() // proceed to next request function
		}else{
			return c.JSON(fiber.Map{"success": false, "code": 403, "message": "this action is forbidden"})
		}

	}
}
