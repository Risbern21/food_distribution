package auth

import (
	"database/sql"
	"errors"
	"fmt"
	"food/models/users"
	"food/utils"
	"strings"

	"github.com/gofiber/fiber/v2"
)

type authRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Create(ctx *fiber.Ctx) error {
	var err error
	user := users.New()
	if err = ctx.BodyParser(&user); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid request body")
	}

	dbUser := users.New()
	dbUser.Email = user.Email
	if err = dbUser.GetByEmail(); err == nil {
		// If no error = record found = user exists
		return ctx.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": "user already exists",
		})
	} else if !errors.Is(err, sql.ErrNoRows) {
		return ctx.Status(fiber.StatusInternalServerError).
			JSON(fiber.Map{"message": "internal server error"})
	}
	user.HashedPassword, err = utils.GetPasswordHash(user.HashedPassword)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON("ineternal sever error")
	}

	if err = user.Create(); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).
			JSON(fmt.Sprintf("unable to create user : %v", err))
	}

	return ctx.Status(fiber.StatusCreated).JSON(user)
}

func Login(ctx *fiber.Ctx) error {
	var req authRequest
	if err := ctx.BodyParser(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err,
		})
	}

	user := users.New()
	user.Email = req.Email

	//fetch user
	if err := user.GetByEmail(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "invalid email",
			})
		}
	}

	if !utils.ComparePassword(user.HashedPassword, req.Password) {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid password %v",
		})
	}

	//generate token
	token, err := utils.GenerateToken(user.UserID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": fmt.Sprintf("ineternal server error %v", err),
		})
	}

	return ctx.JSON(fiber.Map{"token": token})
}

func Me(ctx *fiber.Ctx) error {
	auth := ctx.Get("Authorization")
	tokenArr := strings.Split(auth, " ")

	if auth == "" || len(tokenArr) != 2 || tokenArr[0] != "Bearer" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "no header passed",
		})
	}
	userID, err := utils.GetUserIDFromToken(tokenArr[1])
	if err != nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "invalid token",
		})
	}

	user := users.New()
	user.UserID = userID

	if err := user.Get(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "user not found",
			})
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": fmt.Sprintf("internal server error %v", err),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(user)
}
