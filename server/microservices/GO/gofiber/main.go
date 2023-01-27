package main

import (
	"log"
	middleware "gofiber/src/app/middlewares"
	route "gofiber/src/routes"
	"gofiber/src/app/utility/cache"
	"gofiber/src/app/database/config"
	mixin "gofiber/src/app/utility/mixins"
	"time"
	"github.com/gofiber/fiber/v2"
)

func main() {
	InitServer(); // Initialize backend server
}

func InitServer() {
	defer func() {
		if err := recover(); err != nil {
			middleware.Exceptions(err)
		}
	}()

	// Start a new fiber app
	app := fiber.New(fiber.Config{
		CaseSensitive:           true,
		EnableTrustedProxyCheck: true,
		ReadTimeout:             time.Minute * time.Duration(3), //3 mins read timeout
		WriteTimeout:            time.Minute * time.Duration(5), //5 mins write timeout
		Concurrency:             256 * 1024,                     //Maximum number of concurrent connections. later in the future when GO handles heavy loads, increase this value to 1 million or more i.e 5 * 256 * 1024
		ServerHeader:            mixin.AppName,
		AppName:                 mixin.AppName + " Backend Service",
	})

	// Connect to the Database
	db.ConnectDB()

	// Setup middlewares
	middleware.InitMDW(app)

	// Setup the router
	route.LoadRoutes(app)

	//404 page
	app.Use(func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"success": false, "code": 404, "message": "resource requested not found"})
	})

	//init redis cache
	cache.Initclient()

	// start app
	log.Fatal(app.Listen(":" + mixin.Config("PORT")))

	defer db.Db.Close()
	defer middleware.File.Close()
}