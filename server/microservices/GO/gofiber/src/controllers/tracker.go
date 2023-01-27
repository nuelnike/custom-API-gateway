package controller

import (
	// model "gofiber/src/app/database/models"
	appmodel "gofiber/src/app/utility/appmodel"
	// db "gofiber/src/app/database/config" 
	// mixin "gofiber/src/app/utility/mixins"
	cache "gofiber/src/app/utility/cache"
	// "regexp"
	// "strconv"
	"github.com/gofiber/fiber/v2"
	"fmt"
)

// Status codes
// 201 Created
// 200 OK
// 202 Accepted
// 204 No Content
// 205 Reset Content
// 400 Bad Request
// 401 Unauthorized
// 403 Forbidden
// 404 Not Found
// 405 Method Not Allowed
// 408 Request Timeout
// 415 Unsupported Media Type
// 426 Upgrade Required
// 429 Too Many Requests
// 431 Request Header Fields Too Large
// 500 Internal Server Error
// 502 Bad Gateway
// 503 Service Unavailable
// 504 Gateway Timeout

																		// func SuggestProducts(c *fiber.Ctx) error {

																		// 	db := db.DB
																		// 	var products []model.Product
																		// 	page := c.Query("page");

																		// 	if(page == ""){ 
																		// 		page = "1";
																		// 	}

																		// 	page_num, err := strconv.Atoi(page)

																		// 	if err != nil {
																		// 		fmt.Println(err)
																		// 		return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
																		// 	}

																		// 	_err := db.Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Preload("Category").Preload("Status").Preload("Discount").Find(&products).Error

																		// 	if _err != nil { 
																		// 		fmt.Println(_err)
																		// 		return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
																		// 	}
																		 
																		// 	return c.JSON(fiber.Map{"success": true, "code": 200, "data": products})
																		// }
 
func TrackGlobalActivities(c *fiber.Ctx) error {

	// db := db.DB

	filter := new(appmodel.ProductFilter)

    if err := c.BodyParser(filter); err != nil {
		fmt.Println(err)
        return err
    }

    category := filter.Category
    price := filter.Price
    // tags := filter.Tags
 	
 	key := "category_trends";
	cache.CacheSet(key, category) // get request session key

 	key2 := "price_trends";
	cache.CacheSet(key2, price) // get request session key

 	// key := "category_trends";
	// cache.CacheSet(key, category) // get request session key

		// fmt.Println(category)
		// fmt.Println(price)
	// 	fmt.Println(tags)

	// if _err != nil { 
	// 	fmt.Println(_err)
	// 	return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
	// }
 
	return c.JSON(fiber.Map{"success": true, "code": 200, "data": filter})
}