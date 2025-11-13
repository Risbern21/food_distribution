package auth

import (
	"food/controllers/auth"
	"github.com/gofiber/fiber/v2"
)

func AuthRoutes(r fiber.Router) {
	authRoutes := r.Group("/auth")

	authRoutes.Post("/register", auth.Create)
	authRoutes.Post("/login", auth.Login)
	authRoutes.Get("/me", auth.Me)
}
