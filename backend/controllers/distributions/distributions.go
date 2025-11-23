package distributions

import (
	"database/sql"
	"errors"
	"fmt"
	"food/models/distributions"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func Create(ctx *fiber.Ctx) error {
	distribution := distributions.New()
	distribution.DeliveryStatus = distributions.Pending

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

func GetByDonorID(ctx *fiber.Ctx) error {
	ad := distributions.NewAllDistributions()

	donorID, err := uuid.Parse(ctx.Params("d_id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("inavlid recipient id")
	}

	ad.DonorID = donorID

	if err := ad.GetByDonorID(); err != nil {
		fmt.Printf("%v", err)
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).JSON("no distributions found")
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON("internal sever error")
	}

	return ctx.Status(fiber.StatusOK).JSON(ad.AllStatDistributions)
}

func GetByRecipientID(ctx *fiber.Ctx) error {
	ad := distributions.NewAllDistributions()

	recipientID, err := uuid.Parse(ctx.Params("r_id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("inavlid recipient id")
	}

	ad.RecipientID = recipientID

	if err := ad.GetByRecipientID(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).JSON("no distributions found")
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON("internal sever error")
	}

	return ctx.Status(fiber.StatusOK).JSON(ad.AllStatDistributions)
}

func Update(ctx *fiber.Ctx) error {
	distributionID, err := uuid.Parse(ctx.Params("d_id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid input body")
	}

	distribution := distributions.New()
	distribution.DistributionID = distributionID
	distribution.DeliveryStatus = distributions.Delivered
	distribution.DeliveredAt = time.Now()

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
