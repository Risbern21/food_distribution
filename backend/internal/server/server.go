package server

import (
	"food/routes/auth"
	"food/routes/distributions"
	"food/routes/donations"
	"food/routes/feedbacks"
	"food/routes/users"
	"os"

	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

var app *fiber.App

func New() *fiber.App {
	return app
}

var notFoundHandler = func(ctx *fiber.Ctx) error {
	return ctx.Status(fiber.StatusNotFound).JSON("requested resource not found")
}

func errHandler(ctx *fiber.Ctx, err error) error {
	return ctx.Status(fiber.StatusInternalServerError).JSON(err.Error())
}

func addRoutes(app *fiber.App) {
	baseRouter := app.Group("/api/v1")

	auth.AuthRoutes(baseRouter)
	users.UserRoutes(baseRouter)
	donations.FoodDonationsRoutes(baseRouter)
	distributions.DistributionsRoutes(baseRouter)
	feedbacks.FeedbackRoutes(baseRouter)
}

func Setup() {
	secret := os.Getenv("JWT_SECRET")

	app = fiber.New(fiber.Config{
		ErrorHandler: errHandler,
		BodyLimit:    16 * 1024 * 1024,
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://127.0.0.1:8080,http://localhost:8080",
		AllowHeaders: "*",
	}))
	app.Use(logger.New())
	defer app.Use(notFoundHandler)

	addRoutes(app)

	app.Use(jwtware.New(jwtware.Config{
		SigningKey: jwtware.SigningKey{Key: []byte(secret)},
	}))
}
