package app

import (
	"log"

	"food/internal/database"
	"food/internal/server"
)

func Setup() {
	database.Connect()

	server.Setup()

	app := server.New()

	if err := app.Listen(":42069"); err != nil {
		log.Fatalf("Error trying to start server:%v", err)
	}
}
