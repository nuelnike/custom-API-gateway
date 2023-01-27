package middleware

import (
	"log"
	"os" 
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

//File variable
var File *os.File

//InitMDW
func InitMDW(app *fiber.App) {

	File, err := os.OpenFile("./src/app/logs/.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}

	//logger
	app.Use(logger.New(logger.Config{
		Output: File,
	}))

	//app headers
	Headers(app)

	//cache some routes
	RouteCache(app)
	
}