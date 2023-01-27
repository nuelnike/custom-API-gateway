package middleware

import (
	mixin "gofiber/src/app/utility/mixins"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cache"
)

//RouteCache func for caching specific routes
func RouteCache(app *fiber.App) {
	go func() {
		for k, v := range mixin.CachedRoutes {
			app.Get(k, cache.New(cache.Config{
				Next: func(c *fiber.Ctx) bool {
					return c.Query("refresh") == "true"
				},
				Expiration:   v * time.Minute,
				CacheControl: true,
			}))
		}
	}()
}
