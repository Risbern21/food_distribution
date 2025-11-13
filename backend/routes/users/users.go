package users

import (
	"food/controllers/users"
	"food/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func UserRoutes(r fiber.Router) {
	userRoutes := r.Group("/users")

	userRoutes.Get("/:u_id", middleware.JWTProtected, users.Get)
	userRoutes.Put("/:u_id", middleware.JWTProtected, users.Update)
	userRoutes.Delete("/:u_id", middleware.JWTProtected, users.Delete)
}
