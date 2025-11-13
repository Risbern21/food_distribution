package users

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"food/models/users"
)

func Get(ctx *fiber.Ctx) error {
	user := users.New()
	userID, err := uuid.Parse(ctx.Params("u_id"))

	user.UserID = userID

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid user id")
	}

	if err := user.Get(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).
				JSON("requested user not found")
		}
		return ctx.Status(fiber.StatusInternalServerError).
			JSON(fmt.Sprintf("internal server err:%v", err))
	}

	return ctx.Status(fiber.StatusOK).JSON(user)
}

func Update(ctx *fiber.Ctx) error {
	user := users.New()

	userID, err := uuid.Parse(ctx.Params("u_id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid user id")
	}

	if err := ctx.BodyParser(&user); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid request body")
	}

	user.UserID = userID

	if err := user.Update(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).
				JSON("requested user not found")
		}
		return ctx.Status(fiber.StatusInternalServerError).
			JSON("internal server error")
	}

	return ctx.SendStatus(fiber.StatusNoContent)
}

func Delete(ctx *fiber.Ctx) error {
	userID, err := uuid.Parse(ctx.Params("u_id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid input body")
	}

	user := users.New()
	user.UserID = userID
	if err := user.Delete(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).JSON("user does not exist")
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON("internal server error")
	}

	return ctx.SendStatus(fiber.StatusNoContent)
}
