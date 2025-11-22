package distributions

import (
	"time"

	"food/internal/database"
	"food/models/donations"

	"github.com/google/uuid"
)

type Status string

const (
	Delivered Status = "delivered"
	Pending   Status = "pending"
	Preparing Status = "preparing"
)

type Distributions struct {
	DistributionID  uuid.UUID `json:"distribution_id"  db:"distribution_id"`
	DonationID      uuid.UUID `json:"donation_id"      db:"donation_id"`
	RecipientID     uuid.UUID `json:"recipient_id"     db:"recipient_id"`
	DeliveryStatus  Status    `json:"delivery_status"  db:"delivery_status"`
	DeliveredAt     time.Time `json:"delivered_at"     db:"delivered_at"`
	PickupConfirmed bool      `json:"pickup_confirmed" db:"pickup_confirmed"`
}

func New() *Distributions {
	return &Distributions{}
}

func (d *Distributions) Create() error {
	query := `
		INSERT INTO distributions
		(donation_id,recipient_id,delivery_status,delivered_at,pickup_confirmed)
		VALUES (:donation_id,:recipient_id,:delivery_status,:delivered_at,:pickup_confirmed)
		RETURNING distribution_id;
	`

	donation := donations.New()
	donation.DonationID = d.DonationID

	if err := donation.UpdateAvailable(); err != nil {
		return err
	}

	row, err := database.Client().NamedQuery(query, d)
	if err != nil {
		return err
	}

	if row.Next() {
		if err := row.Scan(&d.DistributionID); err != nil {
			return err
		}
	}

	return nil
}

func (d *Distributions) Get() error {
	query := `
		SELECT * FROM distributions d
		WHERE d.distribution_id = $1;
	`
	if err := database.Client().Get(d, query, d.DistributionID); err != nil {
		return err
	}

	return nil
}

func (d *Distributions) Update() error {
	query := `
	UPDATE distributions
	SET delivery_status=:delivery_status,
	delivered_at = :delivered_at,
	pickup_confirmed = TRUE
	WHERE distribution_id = :distribution_id;
	`

	_, err := database.Client().NamedQuery(query, d)
	if err != nil {
		return err
	}

	return nil
}

func (d *Distributions) Delete() error {
	fetchDonationIDQuery := `
	SELECT donation_id FROM distributions
	WHERE distribution_id= $1;
	`

	deleteQuery := `
	DELETE FROM distributions
	WHERE distribution_id = :distribution_id;
	`

	updateDonationQuery := `
	UPDATE donations
	SET is_available = TRUE
	WHERE donation_id = :donation_id;
	`

	tx := database.Client().MustBegin()
	if err := tx.Get(&d.DonationID, fetchDonationIDQuery, d.DistributionID); err != nil {
		return err
	}

	if _, err := tx.NamedExec(deleteQuery, d); err != nil {
		_ = tx.Rollback()
		return err
	}
	if _, err := tx.NamedExec(updateDonationQuery, d); err != nil {
		_ = tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

type StatDistributions struct {
	DistributionID  uuid.UUID `json:"distribution_id" db:"distribution_id"`
	DonationID      uuid.UUID `json:"donation_id" db:"donation_id"`
	DonorID         uuid.UUID `json:"donor_id" db:"donor_id"`
	DonorEmail      string    `json:"donor_email" db:"donor_email"`
	RecipientEmail  string    `json:"recipient_email" db:"recipient_email"`
	RecipientID     uuid.UUID `json:"recipient_id" db:"recipient_id"`
	DeliveryStatus  Status    `json:"delivery_status" db:"delivery_status"`
	DeliveredAt     time.Time `json:"delivered_at" db:"delivered_at"`
	PickupConfirmed bool      `json:"pickup_confirmed" db:"pickup_confirmed"`
	Title           string    `json:"title" db:"title"`
	Description     string    `json:"description" db:"description"`
	Quantity        int16     `json:"quantity" db:"quantity"`
	Units           string    `json:"units" db:"units"`
}

type AllDistributions struct {
	DonorID              uuid.UUID `db:"donor_id"`
	RecipientID          uuid.UUID `db:"recipient_id"`
	AllDistributions     []Distributions
	AllStatDistributions []StatDistributions
}

func NewAllDistributions() *AllDistributions {
	return &AllDistributions{
		AllDistributions:     []Distributions{},
		AllStatDistributions: []StatDistributions{},
	}
}

func (ad *AllDistributions) Get() error {
	query := `
	SELECT * FROM distributions
	LIMIT 10;
	`
	if err := database.Client().Select(&ad.AllDistributions, query); err != nil {
		return err
	}

	return nil
}

func (ad *AllDistributions) GetByDonorID() error {
	query := `
	SELECT d.* ,u.email AS recipient_email, fd.donor_id,fd.title ,fd.description,fd.quantity,fd.units FROM distributions d
	INNER JOIN donations fd
	ON d.donation_id = fd.donation_id
	INNER JOIN users u
	ON d.recipient_id = u.user_id
	WHERE fd.donor_id = $1;
	`
	if err := database.Client().Select(&ad.AllStatDistributions, query, ad.DonorID); err != nil {
		return err
	}

	return nil
}

func (ad *AllDistributions) GetByRecipientID() error {
	query := `
	SELECT d.* ,u.email AS donor_email ,fd.donor_id,fd.title ,fd.description,fd.quantity,fd.units FROM distributions d
	INNER JOIN donations fd
	ON d.donation_id = fd.donation_id
	INNER JOIN users u
	ON fd.donor_id = u.user_id
	WHERE d.recipient_id = $1;
	`
	if err := database.Client().Select(&ad.AllStatDistributions, query, ad.RecipientID); err != nil {
		return err
	}

	return nil
}
