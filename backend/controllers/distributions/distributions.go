package distributions

import (
	"database/sql"
	"errors"
	"fmt"

	"food/models/distributions"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func Create(ctx *fiber.Ctx) error {
	distribution := distributions.New()

	if err := ctx.BodyParser(distribution); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid request body")
	}

	if err := distribution.Create(); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fmt.Sprintf("internal server error : %v", err))
	}

	return ctx.Status(fiber.StatusCreated).JSON(distribution)
}

func Get(ctx *fiber.Ctx) error {
	distributionID, err := uuid.Parse(ctx.Params("d_id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid distribution id")
	}

	distribution := distributions.New()
	distribution.DistributionID = distributionID

	if err := distribution.Get(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).JSON("no distribution found")
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(err)
	}

	return ctx.Status(fiber.StatusOK).JSON(distribution)
}

func GetAll(ctx *fiber.Ctx) error {
	ad := distributions.NewAllDistributions()

	if err := ad.Get(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).JSON("no distributions found")
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON("internal server error")
	}

	return ctx.Status(fiber.StatusOK).JSON(ad.AllDistributions)
}

func Update(ctx *fiber.Ctx) error {
	distributionID, err := uuid.Parse(ctx.Params("d_id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid input body")
	}

	distribution := distributions.New()
	distribution.DistributionID = distributionID
	if err := distribution.Update(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).JSON("distribution not found")
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON("internal server error")
	}

	return ctx.SendStatus(fiber.StatusNoContent)
}

func Delete(ctx *fiber.Ctx) error {
	distributionID, err := uuid.Parse(ctx.Params("d_id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid distribution id")
	}

	distribution := distributions.New()
	distribution.DistributionID = distributionID

	if err := distribution.Delete(); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON("internal server error")
	}

	return ctx.SendStatus(fiber.StatusNoContent)
}
