package donations

import (
	"time"

	"food/internal/database"

	"github.com/google/uuid"
)

type Donations struct {
	DonationID  uuid.UUID `json:"donation_id"     db:"donation_id"`
	DonorID     uuid.UUID `json:"donor_id"        db:"donor_id"`
	Title       string    `json:"title"           db:"title"`
	Description string    `json:"description"     db:"description"`
	Quantity    int16     `json:"quantity"        db:"quantity"`
	Units       string    `json:"units"           db:"units"`
	IsAvailable bool      `json:"is_available,omitempty"    db:"is_available"`
	PickupTime  time.Time `json:"pickup_time"     db:"pickup_time"`
	ExpiryTime  time.Time `json:"expiry_time"     db:"expiry_time"`
}

func New() *Donations {
	return &Donations{}
}

func (fd *Donations) Create() error {
	query := `
		INSERT INTO donations (donor_id,title,description,quantity,units,pickup_time,expiry_time)
	VALUES (:donor_id,:title,:description,:quantity,:units,:pickup_time,:expiry_time) 
		RETURNING donation_id;
	`
	row, err := database.Client().NamedQuery(query, fd)
	if err != nil {
		return err
	}

	if row.Next() {
		if err := row.Scan(&fd.DonationID); err != nil {
			return err
		}
	}

	return nil
}

func (fd *Donations) Get() error {
	query := `
		SELECT * FROM donations f
		WHERE f.donation_id = $1;
	`

	if err := database.Client().Get(fd, query, fd.DonationID); err != nil {
		return err
	}

	return nil
}

func (fd *Donations) Update() error {
	query := `
		UPDATE donations
		SET title = :title,
		description = :description,
		quantity = :quantity,
		pickup_time = :pickup_time ,
		expiry_time = :expiry_time
		WHERE donation_id = :donation_id;
	`

	_, err := database.Client().NamedExec(query, fd)
	if err != nil {
		return err
	}

	return nil
}

func (fd *Donations) UpdateAvailable() error {
	query := `
	UPDATE donations
	SET is_available = FALSE
	WHERE donation_id = :donation_id;
	`

	_, err := database.Client().NamedExec(query, fd)
	if err != nil {
		return err
	}
	return nil
}

func (fd *Donations) Delete() error {
	query := `
	DELETE FROM donations
	WHERE donation_id = :donation_id;
	`
	_, err := database.Client().NamedExec(query, fd)
	if err != nil {
		return err
	}

	return nil
}

type AllDonations struct {
	DonorID      uuid.UUID
	AllDonations []Donations
}

func NewAllDonations() *AllDonations {
	return &AllDonations{
		AllDonations: []Donations{},
	}
}

func (ad *AllDonations) Get() error {
	query := `
	SELECT * FROM donations
	WHERE donor_id = $1;
	`
	if err := database.Client().Select(&ad.AllDonations, query, ad.DonorID); err != nil {
		return err
	}
	return nil
}

func (ad *AllDonations) GetAvailable() error {
	query := `
		SELECT * FROM donations d
		WHERE is_available IS TRUE;
	`

	if err := database.Client().Select(&ad.AllDonations, query); err != nil {
		return err
	}
	return nil
}
