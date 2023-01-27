package route

import (
	controller "gofiber/src/controllers"
	middleware "gofiber/src/app/middlewares"
	"github.com/gofiber/fiber/v2"
)

//SetupOrderRoutes func
func OrderRoutes(router fiber.Router) {

	order := router.Group("/api/v1/order")

	order.Get("/", middleware.Session, controller.Order)
	order.Get("/all", middleware.Session, controller.Orders)
	order.Get("/filter-order", middleware.Session, controller.FilterOrders)
	order.Get("/user", middleware.Session, controller.UserOrders)
	order.Get("/filter-user-order", middleware.Session, controller.FilterUserOrders)
	order.Get("/search-user-order", middleware.Session, controller.SearchUserOrder)
	order.Get("/search-order", middleware.Session, controller.SearchOrder)
	order.Post("/create", middleware.Session, controller.CreateOrder)
}
