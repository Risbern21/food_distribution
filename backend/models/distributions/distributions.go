package distributions

import (
	"time"

	"food/internal/database"

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
	pickup_confirmed = :pickup_confirmed
	WHERE distribution_id = :distribution_id;
	`

	_, err := database.Client().NamedQuery(query, d)
	if err != nil {
		return err
	}

	return nil
}

func (d *Distributions) Delete() error {
	query := `
	DELETE FROM distributions
	WHERE distribution_id = :distribution_id;
	`

	_, err := database.Client().NamedQuery(query, d)
	if err != nil {
		return err
	}

	return nil
}

type AllDistributions struct {
	AllDistributions []Distributions
}

func NewAllDistributions() *AllDistributions {
	return &AllDistributions{
		AllDistributions: []Distributions{},
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
