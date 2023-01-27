package route

import (
	"github.com/gofiber/fiber/v2"
)

//SetupRoutes func
func LoadRoutes(app *fiber.App) {
	ProductRoutes(app)
	OrderRoutes(app)
	TrackerRoutes(app)
}
