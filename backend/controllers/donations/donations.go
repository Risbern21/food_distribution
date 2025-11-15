package donations

import (
	"database/sql"
	"errors"
	"fmt"

	"food/models/donations"
	"food/models/users"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func Create(ctx *fiber.Ctx) error {
	fd := donations.New()

	if err := ctx.BodyParser(&fd); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": fmt.Sprintf("invalid input body : %v", err)})
	}

	u := users.New()
	u.UserID = fd.DonorID
	if err := u.Get(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).JSON("user does not exist")
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(fmt.Sprintf("internal server error : %v", err))
	}
	if err := fd.Create(); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(err)
	}

	return ctx.Status(fiber.StatusCreated).JSON(fd)
}

func Get(ctx *fiber.Ctx) error {
	fd := donations.New()

	donationID, err := uuid.Parse(ctx.Params("fd_id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid food donation id")
	}

	fd.DonationID = donationID
	if err := fd.Get(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).JSON("food donation not found")
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON("internal server error")
	}

	return ctx.Status(fiber.StatusOK).JSON(fd)
}

func GetAll(ctx *fiber.Ctx) error {
	allDonations := donations.NewAllDonations()

	userID, err := uuid.Parse(ctx.Params("u_id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid user id")
	}

	allDonations.DonorID = userID

	if err := allDonations.Get(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).JSON("no donations found")
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(err)
	}

	return ctx.Status(fiber.StatusOK).JSON(allDonations.AllDonations)
}

func GetAvailable(ctx *fiber.Ctx) error {
	d := donations.NewAllDonations()

	if err := d.GetAvailable(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "no available donations",
			})
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": fmt.Sprintf("internal server error:%v", err),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(d.AllDonations)
}

func Update(ctx *fiber.Ctx) error {
	fd := donations.New()

	donationID, err := uuid.Parse(ctx.Params("fd_id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid donation id")
	}

	if err := ctx.BodyParser(&fd); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid input body")
	}
	fd.DonationID = donationID
	if err := fd.Update(); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON("internal server error")
	}

	return ctx.SendStatus(fiber.StatusNoContent)
}

func Delete(ctx *fiber.Ctx) error {
	fd := donations.New()

	donationID, err := uuid.Parse(ctx.Params("fd_id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid input body")
	}

	fd.DonationID = donationID
	if err := fd.Delete(); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON("internal server error")
	}

	return ctx.SendStatus(fiber.StatusNoContent)
}
