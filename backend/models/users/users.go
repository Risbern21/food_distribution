package users

import (
	"github.com/google/uuid"

	"food/internal/database"
)

type User string

const (
	donor     User = "donor"
	recipient User = "recipient"
)

type Users struct {
	UserID         uuid.UUID `json:"user_id"         db:"user_id"`
	Username       string    `json:"username"        db:"username"`
	Email          string    `json:"email"           db:"email"`
	HashedPassword string    `json:"hashed_password" db:"hashed_password"`
	Phone          string    `json:"phone"           db:"phone"`
	Address        string    `json:"address"         db:"address"`
	UserType       User      `json:"user_type"       db:"user_type"`
}

func New() *Users {
	return &Users{}
}

func (u *Users) Create() error {
	query := `INSERT INTO users (username,email,hashed_password,phone,address,user_type)
	VALUES (:username,:email,:hashed_password,:phone,:address,:user_type) RETURNING user_id;`

	row, err := database.Client().NamedQuery(query, u)
	if err != nil {
		return err
	}
	defer row.Close()

	if row.Next() {
		if err := row.Scan(&u.UserID); err != nil {
			return err
		}
	}
	return nil
}

func (u *Users) Get() error {
	query := `
		SELECT * FROM users u WHERE u.user_id = $1;
	`
	if err := database.Client().Get(u, query, u.UserID); err != nil {
		return err
	}

	return nil
}

func (u *Users) GetByEmail() error {
	query := `
		SELECT * FROM users u WHERE u.email = $1
	`

	if err := database.Client().Get(u, query, u.Email); err != nil {
		return err
	}
	return nil
}

func (u *Users) Update() error {
	query := `
		UPDATE users
		SET username = :username,
		email = :email,
		hashed_password = :hashed_password,
		phone = :phone,
		address = :address
		WHERE user_id = :user_id;
	`

	_, err := database.Client().NamedExec(query, u)
	if err != nil {
		return err
	}

	return nil
}

func (u *Users) Delete() error {
	query := `
	DELETE FROM users
	WHERE user_id = :user_id;
	`

	_, err := database.Client().NamedQuery(query, u)
	if err != nil {
		return err
	}

	return nil
}
