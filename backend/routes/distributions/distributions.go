package distributions

import (
	"food/controllers/distributions"

	"food/internal/middleware"
	"github.com/gofiber/fiber/v2"
)

func DistributionsRoutes(r fiber.Router) {
	distributionsRoutes := r.Group("/distributions")

	distributionsRoutes.Post("/", middleware.JWTProtected, distributions.Create)
	distributionsRoutes.Get("/all", middleware.JWTProtected, distributions.GetAll)
	distributionsRoutes.Get("/:d_id", middleware.JWTProtected, distributions.Get)
	distributionsRoutes.Put("/:d_id", middleware.JWTProtected, distributions.Update)
	distributionsRoutes.Delete("/:d_id", middleware.JWTProtected, distributions.Delete)
}
