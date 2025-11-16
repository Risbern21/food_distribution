package feedbacks

import (
	"food/controllers/feedbacks"
	"food/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func FeedbackRoutes(r fiber.Router) {
	feedbackRoutes := r.Group("/feedbacks")

	feedbackRoutes.Post("/", middleware.JWTProtected, feedbacks.Create)
	feedbackRoutes.Get("/:f_id", middleware.JWTProtected, feedbacks.Get)
	feedbackRoutes.Get("/all/:u_id", middleware.JWTProtected, feedbacks.GetAll)
}
