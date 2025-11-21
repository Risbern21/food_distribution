package main

import (
	"log"

	"github.com/joho/godotenv"

	"food/cmd/app"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("unable to load env:%v,using docker injected vars", err)
	}

	app.Setup()
}
