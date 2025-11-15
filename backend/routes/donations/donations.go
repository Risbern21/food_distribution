package donations

import (
	"food/controllers/donations"
	"food/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func FoodDonationsRoutes(r fiber.Router) {
	foodDonationsRoutes := r.Group("/donations")

	foodDonationsRoutes.Post("/", middleware.JWTProtected, donations.Create)
	foodDonationsRoutes.Get("/:fd_id", middleware.JWTProtected, donations.Get)
	foodDonationsRoutes.Get("/my_donations/:u_id", middleware.JWTProtected, donations.GetAll)
	foodDonationsRoutes.Get("/all/available", middleware.JWTProtected, donations.GetAvailable)
	foodDonationsRoutes.Put("/:fd_id", middleware.JWTProtected, donations.Update)
	foodDonationsRoutes.Delete("/:fd_id", middleware.JWTProtected, donations.Delete)
}
