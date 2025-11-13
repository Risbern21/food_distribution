package feedbacks

import (
	"database/sql"
	"errors"
	"fmt"

	"food/models/feedbacks"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func Create(ctx *fiber.Ctx) error {
	feedback := feedbacks.New()
	if err := ctx.BodyParser(feedback); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid input body")
	}

	if err := feedback.Create(); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fmt.Sprintf("internal server error:%v", err))
	}

	return ctx.Status(fiber.StatusCreated).JSON(feedback)
}

func Get(ctx *fiber.Ctx) error {
	feedback := feedbacks.New()

	feedbackID, err := uuid.Parse(ctx.Params("f_id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid feedback id")
	}

	feedback.FeedbackID = feedbackID

	if err := feedback.Get(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).JSON("feedback not found")
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(fmt.Sprintf("internal server error:%v", err))
	}

	return ctx.Status(fiber.StatusOK).JSON(feedback)
}

func GetAll(ctx *fiber.Ctx) error {
	allFeedbacks := feedbacks.NewAllFeedbacks()

	userID, err := uuid.Parse(ctx.Params("u_id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid user id")
	}

	allFeedbacks.UserID = userID

	if err := allFeedbacks.Get(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).JSON("no feedbacks found")
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(fmt.Sprintf("internal server error:%v", err))
	}

	return ctx.Status(fiber.StatusOK).JSON(allFeedbacks)
}

func Update(ctx *fiber.Ctx) error {
	feedback := feedbacks.New()

	feedbackID, err := uuid.Parse("f_id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid feedback id")
	}

	feedback.FeedbackID = feedbackID

	if err := feedback.Update(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).JSON("feedback not found")
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(fmt.Sprintf("internal server error:%v", err))
	}

	return ctx.SendStatus(fiber.StatusNoContent)
}

func Delete(ctx *fiber.Ctx) error {
	feedback := feedbacks.New()

	feedbackID, err := uuid.Parse("f_id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("invalid feedback id")
	}

	feedback.FeedbackID = feedbackID

	if err := feedback.Delete(); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Status(fiber.StatusNotFound).JSON("feedback not found")
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(fmt.Sprintf("internal server error:%v", err))
	}
	return ctx.SendStatus(fiber.StatusNoContent)
}
