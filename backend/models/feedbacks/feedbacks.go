package feedbacks

import (
	"food/internal/database"
	"time"

	"github.com/google/uuid"
)

type Rating int8

const (
	Bad      Rating = 1
	Poor     Rating = 2
	Average  Rating = 3
	Good     Rating = 4
	VeryGood Rating = 5
)

type Feedbacks struct {
	FeedbackID     uuid.UUID `json:"feedback_id"     db:"feedback_id"`
	DistributionID uuid.UUID `json:"distribution_id" db:"distribution_id"`
	RecipientID    uuid.UUID `json:"recipient_id"    db:"recipient_id"`
	DonorID        uuid.UUID `json:"donor_id"        db:"donor_id"`
	Rating         Rating    `json:"rating"          db:"rating"`
	Comments       string    `json:"comments"        db:"comments"`
	CreatedAt      time.Time `json:"created_at"      db:"created_at"`
}

func New() *Feedbacks {
	return &Feedbacks{}
}

func (f *Feedbacks) Create() error {
	query := `
		INSERT INTO Feedbacks (distribution_id,recipient_id,donor_id,rating,comments,created_at)
	VALUES (:distribution_id,:recipient_id,:donor_id,:rating,:comments,:created_at) 	RETURNING feedback_id;
	`
	row, err := database.Client().NamedQuery(query, f)
	if err != nil {
		return err
	}
	defer row.Close()

	if row.Next() {
		if err := row.Scan(&f.FeedbackID); err != nil {
			return err
		}
	}

	return nil
}

func (f *Feedbacks) Get() error {
	query := `
		SELECT * FROM feedbacks f
		WHERE f.feedback_id = $1;
	`
	if err := database.Client().Get(f, query, f.FeedbackID); err != nil {
		return err
	}

	return nil
}

type CustomFeedbacks struct {
	FeedbackID     uuid.UUID `json:"feedback_id" db:"feedback_id"`
	DistributionID uuid.UUID `json:"distribution_id" db:"distribution_id"`
	RecipientID    uuid.UUID `json:"recipient_id" db:"recipient_id"`
	DonorID        uuid.UUID `json:"donor_id" db:"donor_id"`
	Rating         Rating    `json:"rating" db:"rating"`
	Comments       string    `json:"comments" db:"comments"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	DonationTitle  string    `json:"donation_title" db:"title"`
	RecipientEmail string    `json:"recipient_email" db:"email"`
}

type AllFeedbacks struct {
	DonorID      uuid.UUID `db:"donor_id"`
	AllFeedbacks []CustomFeedbacks
}

func NewAllFeedbacks() *AllFeedbacks {
	return &AllFeedbacks{}
}

func (af *AllFeedbacks) Get() error {
	query := `
		select f.*,u.email,dn.title from feedbacks f
	  inner join distributions d
	  on f.distribution_id = d.distribution_id
	  inner join donations dn
		on d.donation_id = dn.donation_id
		inner join users u 
		on f.recipient_id = u.user_id 
		where f.donor_id = $1;
	`

	if err := database.Client().Select(&af.AllFeedbacks, query, af.DonorID); err != nil {
		return err
	}

	return nil
}
