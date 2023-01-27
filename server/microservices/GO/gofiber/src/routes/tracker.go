package route

import (
	controller "gofiber/src/controllers"
	middleware "gofiber/src/app/middlewares"
	"github.com/gofiber/fiber/v2"
)

//SetupTrackerRoutes func
func TrackerRoutes(router fiber.Router) {

	tracker := router.Group("/api/v1/tracker") 
	// Tracker AI suggestions and fetch
	tracker.Post("/track-product-global-activities", middleware.Session, controller.TrackGlobalActivities)

}
