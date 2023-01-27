package controller

import ( 
	"github.com/gofiber/fiber/v2"
	"regexp"
	"strconv"
	"fmt"
	model "gofiber/src/app/database/models"
	db "gofiber/src/app/database/config" 
	mixin "gofiber/src/app/utility/mixins"
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


func Order(c *fiber.Ctx) error {
	//write your logic here

	db := db.DB
	id := c.Query("id");

	var order model.Order
	var check_id bool

	check_id = regexp.MustCompile(`\d`).MatchString(id) 

	if (check_id == false || id == "") {
		return c.JSON(fiber.Map{"success": false, "code": 406, "message": "request is invalid"})
	}else {

		result := db.Where("id = ?", id).Preload("User").Preload("DeliveryType").Preload("Status").First(&order)
		
		if result.Error != nil { 
			return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
		}
		
		return c.JSON(fiber.Map{"success": true, "code": 200, "data": order})
	}
	
}

func CreateOrder(c *fiber.Ctx) error {
	//write your logic here
	db := db.DB

	var order model.Order 
	var product model.Product
	// var total int
	var sub_amount int
	var discount int

	orderCart := new(model.Order)
    if err := c.BodyParser(orderCart); err != nil {
        return err
    }

	order.UserID = orderCart.UserID
	order.StatusID = orderCart.StatusID
	order.ShippingCost = orderCart.ShippingCost
	order.DeliveryTypeID = orderCart.DeliveryTypeID
	order.Cart = orderCart.Cart

	if order.UserID == "" {
		return c.JSON(fiber.Map{"success": false, "code": 400, "message": "bad request"})
	}else if len(order.Cart) == 0 {
		return c.JSON(fiber.Map{"success": false, "code": 400, "message": "no item present in order cart"})
	}else if order.StatusID < 1 {
		return c.JSON(fiber.Map{"success": false, "code": 400, "message": "order status is not specified."})
	}else if order.DeliveryTypeID < 1 {
		return c.JSON(fiber.Map{"success": false, "code": 400, "message": "order status is not specified."})
	}

	for k, v := range order.Cart { // parse cart items to get product price and discount
		
		db.Where("id  = ?",  v.ProductID).Preload("Discount").First(&product) // get product
		order.Cart[k].Price = product.Price; // prepare price
		order.Cart[k].DiscountAmount = product.Discount.Rate; // prepare discount
		sub_amount +=  order.Cart[k].Quantity * order.Cart[k].Price // sum itrate order sub_amount amount
		discount +=  order.Cart[k].DiscountAmount // sum itrate order discount

	}

	order.SubAmount = sub_amount // prepare order sub_amount amount 
	order.DiscountAmount = discount // prepare total order discount
	order.TotalAmount = order.ShippingCost + sub_amount - discount; // prepare total amount

    result := db.Create(&order);

    if result.Error != nil { 
    	fmt.Println(result.Error)
		return c.JSON(fiber.Map{"success": false, "code": 500, "message": "encountered an internal server error"})
	}
  
	return c.JSON(fiber.Map{"success": true, "code": 200, "message": "order was placed successfully"})
}

func Orders(c *fiber.Ctx) error {

	db := db.DB
	var orders []model.Order
	var total int64
	page := c.Query("page");
	// var _er string

	if(page == ""){ 
		page = "1";
	}

	page_num, err := strconv.Atoi(page)
	if err != nil {
		fmt.Println(err)
		return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
	}
 
	result := db.Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Preload("User").Preload("Status").Preload("DeliveryType").Find(&orders).Count(&total)

	if (result.Error != nil) { 
		return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
	}
	return c.JSON(fiber.Map{"success": true, "code": 200, "page": page, "total": total, "data": orders})
}

func FilterOrders(c *fiber.Ctx) error {

	db := db.DB
	var orders []model.Order
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

		result := db.Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Preload("User").Preload("Status").Preload("DeliveryType").Find(&orders).Count(&total)

		if (result.Error != nil) {  
			return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
		}

	}else{ // if request has filter 


		if(typ == "date"){ // if request is filtered by date

			result := db.Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Preload("User").Preload("Status").Preload("DeliveryType").Find(&orders, "created_at BETWEEN ? AND ?", date_one, date_two).Count(&total)

			if (result.Error != nil) {  
				return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
			}

		}else if(typ == "status"){ // if request is filtered by order status

			result := db.Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Preload("User").Preload("Status").Preload("DeliveryType").Find(&orders, "status_id = ?", filter).Count(&total)

			if (result.Error != nil) {
				return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
			}
		}else if(typ == "combo"){ // if request is filtered by order status

			result := db.Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Preload("User").Preload("Status").Preload("DeliveryType").Find(&orders, "created_at BETWEEN ? AND ? AND status_id = ?", date_one, date_two, filter).Count(&total)

			if (result.Error != nil) {
				return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
			}
		}
	}
 
	return c.JSON(fiber.Map{"success": true, "code": 200, "page": page, "total": total, "data": orders})
}

func UserOrders(c *fiber.Ctx) error {

	db := db.DB
	var orders []model.Order
	var total int64
	id := c.Query("id");
	page := c.Query("page");

	if(page == ""){ 
		page = "1";
	}

	page_num, err := strconv.Atoi(page) // try convert page number to int
	if (err != nil) { // if it fails to convert
		fmt.Println(err)
		return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
	}
  

	result := db.Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Preload("User").Preload("Status").Preload("DeliveryType").Find(&orders, "user_id", id).Count(&total)

	if (result.Error != nil) {
		return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
	} 

	return c.JSON(fiber.Map{"success": true, "code": 200, "page": page, "total": total, "data": orders})
}

func FilterUserOrders(c *fiber.Ctx) error {

	db := db.DB
	var orders []model.Order
	var total int64
	id := c.Query("id");
	page := c.Query("page");
	typ := c.Query("typ");
	date_one := c.Query("date_one");
	date_two := c.Query("date_two");
	filter := c.Query("filter");

	if(page == ""){ 
		page = "1";
	}

	page_num, err := strconv.Atoi(page) // try convert page number to int
	if (err != nil) { // if it fails to convert
		fmt.Println(err)
		return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
	}

	if(typ == ""){ // if request has no filter

		result := db.Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Preload("User").Preload("Status").Preload("DeliveryType").Find(&orders, "user_id", id).Count(&total)

		if (result.Error != nil) {
			return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
		}

	}else{ // if request has filter 
		if(typ == "date"){ // if request is filtered by date

			result := db.Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Preload("User").Preload("Status").Preload("DeliveryType").Find(&orders, "created_at BETWEEN ? AND ? AND user_id = ?", date_one, date_two, id).Count(&total)

			if (result.Error != nil) { 
				fmt.Println(result.Error)
				return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
			}

		}else if(typ == "status"){ // if request is filtered by order status

			result := db.Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Preload("User").Preload("Status").Preload("DeliveryType").Find(&orders, "user_id = ? AND status_id = ?", id, filter).Count(&total)

			if result.Error != nil { 
				fmt.Println(result.Error)
				return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
			}

		}else if(typ == "combo"){ // if request is filtered by order status

			result := db.Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Preload("User").Preload("Status").Preload("DeliveryType").Find(&orders, "created_at BETWEEN ? AND ? AND user_id = ? AND status_id = ? ", date_one, date_two, id, filter).Count(&total)

			if result.Error != nil { 
				fmt.Println(result.Error)
				return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
			}

		}
	}
 
	return c.JSON(fiber.Map{"success": true, "code": 200, "page": page, "total": total, "data": orders})
}

func SearchUserOrder(c *fiber.Ctx) error {
	//write your logic here

	db := db.DB
	var total int64
	var check_id bool
	id := c.Query("id");
	_query := c.Query("q");
	page := c.Query("page");

	if(page == ""){ 
		page = "1";
	}

	page_num, err := strconv.Atoi(page);
	if err != nil { 
		return c.JSON(fiber.Map{"success": false, "code": 400, "message": "bad request"});
	}

	check_id = regexp.MustCompile(`\d`).MatchString(id) 
 
	if (_query == "" || check_id == false || id == "") {
		return c.JSON(fiber.Map{"success": false, "code": 406, "message": "bad request, try again."})
	}else {

		var orders []model.Order

		result := db.Where("invoice_no LIKE ? AND user_id = ?", "%" + _query + "%", id).Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Find(&orders).Count(&total)
	 
		if result.Error != nil { 
			return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
		}
		
		return c.JSON(fiber.Map{"success": true, "code": 200, "page": page, "total": total, "data": orders})
	}
	
}

func SearchOrder(c *fiber.Ctx) error {
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
	}else if (_query == "") {
		return c.JSON(fiber.Map{"success": false, "code": 406, "message": "bad request, try again."})
	}else {

		var orders []model.Order

		result := db.Where("invoice_no LIKE ?", "%" + _query + "%").Limit(mixin.PageSize).Offset(mixin.PageOffset(page_num)).Find(&orders).Count(&total)
	 
		if result.Error != nil { 
			return c.JSON(fiber.Map{"success": false, "code": 500, "message": "internal server error"})
		}
		
		return c.JSON(fiber.Map{"success": true, "code": 200, "page": page, "total": total, "data": orders})
	}
	
}