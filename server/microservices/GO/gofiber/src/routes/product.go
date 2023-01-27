package route

import (
	controller "gofiber/src/controllers"
	middleware "gofiber/src/app/middlewares"
	"github.com/gofiber/fiber/v2"
)

//SetupProductRoutes func
func ProductRoutes(router fiber.Router) {

	product := router.Group("/api/v1/product")
	product.Get("/", middleware.Session, controller.Product)
	product.Get("/all", middleware.Session, controller.Products)
	product.Get("/categories", middleware.Session, controller.Categories)
	product.Get("/discounts", middleware.Session, controller.Discounts)
	product.Get("/category", middleware.Session, controller.ByCategory)
	product.Get("/search", middleware.Session, controller.Search)
	product.Post("/update", middleware.Session, controller.Update)
	product.Post("/create", middleware.Session, controller.Create)

}
