package middleware

import (
	mixin "gofiber/src/app/utility/mixins"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

//Headers func
func Headers(app *fiber.App) {
	//used for recovering from any panics thrown
	app.Use(recover.New())

	//response compression
	app.Use(compress.New(compress.Config{
		Level: compress.LevelBestCompression,
	}))

	//cors
	app.Use(cors.New(cors.Config{
		AllowOrigins: mixin.ALLOWED_ORIGINS,
		AllowHeaders: mixin.ALLOWED_HEADERS,
		AllowMethods: mixin.ALLOWED_METHODS,
	}))

	app.Use(func(c *fiber.Ctx) error {
		c.Set("Content-Type", "application/json")
		return c.Next()
	})
}
