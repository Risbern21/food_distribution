package main

import (
	"log"

	"github.com/joho/godotenv"

	"food/cmd/app"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("unable to load env:%v", err)
	}

	app.Setup()
}
