package controller

import (
	model "gofiber/src/app/database/models"
	db "gofiber/src/app/database/config" 
	mixin "gofiber/src/app/utility/mixins"
	cache "gofiber/src/app/utility/cache"
	"encoding/json"
	"regexp"
	"strconv"
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

func Products(c *fiber.Ctx) error {

	db := db.DB
	var products model.Products
	page := c.Query("page");
	if(page == ""){ 
		page = "1";
	} 
	page_num, _ := strconv.Atoi(page)
	key := "products";

	_cache, _ := cache.GetCache(key+"_"+page) // load from cache using page number

	if _cache != "" { 
		if err := json.Unmarshal([]byte(_cache), &products); err != nil {
			fmt.Println("err")
		}
	}else{ 

		_err := db.Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Preload("Category").Preload("Status").Preload("Discount").Find(&products).Error

		if _err != nil { 
			fmt.Println(_err)
			return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
		}

		if len(products) == mixin.PageSize { // if products available equals page size
			cache.StoreCache(key+"_"+page, products, 0, true) // store to cache
		}
	}

	return c.JSON(fiber.Map{"success": true, "code": 200, "data": products})
 
}

func Categories(c *fiber.Ctx) error {

	db := db.DB

	var categories []model.Category

	db.Find(&categories)

	return c.JSON(fiber.Map{"success": true, "code": 200, "data": categories})
}

func Discounts(c *fiber.Ctx) error {

	db := db.DB

	var discounts []model.Discount

	db.Find(&discounts)

	return c.JSON(fiber.Map{"success": true, "code": 200, "data": discounts})
}

func Product(c *fiber.Ctx) error {
	//write your logic here

	db := db.DB
	id := c.Query("id");

	var product model.Product
	var check_id bool

	check_id = regexp.MustCompile(`\d`).MatchString(id) 

	if (check_id == false || id == "") {
		return c.JSON(fiber.Map{"success": false, "code": 406, "message": "request is invalid"})
	}else {

		result := db.Where("id = ?", id).Preload("Discount").Preload("Category").Preload("Status").First(&product)
	 
		if result.Error != nil { 
			return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
		}
		
		return c.JSON(fiber.Map{"success": true, "code": 200, "data": product})
	}
	
}

func ByCategory(c *fiber.Ctx) error {
	//write your logic here

	db := db.DB

	var products []model.Product

	id := c.Query("id")
	page := c.Query("page");
	var check_id bool

	if(page == ""){ 
		page = "1";
	}

	page_num, err := strconv.Atoi(page)
	check_id = regexp.MustCompile(`\d`).MatchString(id) 

	if err != nil {

		fmt.Println(err)
		return c.JSON(fiber.Map{"success": false, "code": 400, "message": "bad request"});

	}else if (check_id == false || id == "") {

		return c.JSON(fiber.Map{"success": false, "code": 400, "message": "bad request"});

	}else {

		offset := (page_num - 1) * 1; 

		_err := db.Limit(mixin.PageSize).Offset(offset).Find(&products, "category_id = ?", id).Error
		
		if (_err != nil){ 
			return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"});
		}

		return c.JSON(fiber.Map{"success": true, "code": 200, "data": products})
	}
 
}

func Search(c *fiber.Ctx) error {
	//write your logic here

	db := db.DB
	_query := c.Query("q");
	var total int64 
	page := c.Query("page");

	if(page == ""){ 
		page = "1";
	}

	page_num, err := strconv.Atoi(page);
	if err != nil { 
		return c.JSON(fiber.Map{"success": false, "code": 400, "message": "bad request"});
	}
 
	if (_query == "") {
		return c.JSON(fiber.Map{"success": false, "code": 406, "message": "bad request, try again."})
	}

	var products []model.Product

	result := db.Where("name LIKE ?", "%" + _query + "%").Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Find(&products).Count(&total)
	
	if result.Error != nil { 
		return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
	}
	
	return c.JSON(fiber.Map{"success": true, "code": 200, "page": page, "total": total, "data": products})
} 

func Filter(c *fiber.Ctx) error {

	db := db.DB
	var products []model.Product
	var total int64
	page := c.Query("page");
	typ := c.Query("typ");
	date_one := c.Query("date_one");
	date_two := c.Query("date_two");
	filter := c.Query("filter");
	// var _er string

	if(page == ""){ 
		page = "1";
	}

	page_num, err := strconv.Atoi(page)
	if err != nil {
		fmt.Println(err)
		return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
	}
 	 

	if(typ == ""){ // if request has no filter

		result := db.Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Find(&products).Count(&total)

		if (result.Error != nil) {  
			return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
		}

	}else{ // if request has filter 


		if(typ == "date"){ // if request is filtered by date

			result := db.Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Find(&products, "created_at BETWEEN ? AND ?", date_one, date_two).Count(&total)

			if (result.Error != nil) {  
				return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
			}

		}else if(typ == "status"){ // if request is filtered by product status

			result := db.Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Find(&products, "status_id = ?", filter).Count(&total)

			if (result.Error != nil) {
				return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
			}
		}else if(typ == "combo"){ // if request is filtered by product status

			result := db.Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Find(&products, "created_at BETWEEN ? AND ? AND status_id = ?", date_one, date_two, filter).Count(&total)

			if (result.Error != nil) {
				return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
			}
		}
	}
 
	return c.JSON(fiber.Map{"success": true, "code": 200, "page": page, "total": total, "data": products})
}

func Update(c *fiber.Ctx) error {
	db := db.DB
	var product model.Product

	id := c.Query("id");
	typ := c.Query("typ");

	db.Find(&product, "id = ?", id)

	if product.ID == "" {
		return c.JSON(fiber.Map{"success": false, "code": 404, "message": "No product found"})
	}

	var update model.Product
	c.BodyParser(&update)

	if(typ == "" || typ == "normal"){

		update.Prepare()

		if update.Name == "" {
			return c.JSON(fiber.Map{"success": false, "code": 400, "message": "product name is required"})
		}

		if update.Price < 1 {
			return c.JSON(fiber.Map{"success": false, "code": 400, "message": "product price is required"})
		} 

		if update.CategoryID < 1 {
			return c.JSON(fiber.Map{"success": false, "code": 400, "message": "product category is required"})
		}

		go func() {

			product.Name = update.Name
			product.Price = update.Price
			product.DiscountID = update.DiscountID
			product.CategoryID = update.CategoryID
			product.Description = update.Description
			db.Save(&product)

		}()

	}else if(typ == "restock"){

		if (update.Instock <= 0) {
			return c.JSON(fiber.Map{"success": false, "code": 400, "message": "product stock is invalid, try again with stock greater than 0"})
		}
		go func() { 

			product.Instock += update.Instock
			db.Save(&product)

		}()

	}

	return c.JSON(fiber.Map{"success": true, "code":200, "message": "Product updated", "data": product})
}

func Create(c *fiber.Ctx) error {
	//write your logic here

	db := db.DB

	product := new(model.Product)

    if err := c.BodyParser(product); err != nil {
        return err
    }

	if product.Name == "" {
		return c.JSON(fiber.Map{"success": false, "code": 400, "message": "product name is invalid"})
	}else if product.Price < 1 {
		return c.JSON(fiber.Map{"success": false, "code": 400, "message": "product price is invalid"})
	}else if product.Instock < 1 {
		return c.JSON(fiber.Map{"success": false, "code": 400, "message": "product stock is invalid"})
	}else if product.StatusID < 1 {
		return c.JSON(fiber.Map{"success": false, "code": 400, "message": "order status is not specified."})
	}else if product.CategoryID < 1 {
		return c.JSON(fiber.Map{"success": false, "code": 400, "message": "order category is not specified."})
	}
 
    result := db.Create(&product);

    if result.Error != nil { 
    	fmt.Println(result.Error)
		return c.JSON(fiber.Map{"success": false, "code": 500, "message": "encountered an internal server error"})
	}
  
	return c.JSON(fiber.Map{"success": true, "code": 200, "message": "product was created successfully"})
}