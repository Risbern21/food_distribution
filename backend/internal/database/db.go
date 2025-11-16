package database

import (
	"food/utils"
	"log"
	"os"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

const schema = `
	CREATE TABLE IF NOT EXISTS users (
		user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		username TEXT,
		email TEXT,
		hashed_password TEXT,
		phone TEXT,
		address TEXT,
		user_type TEXT
	);

	CREATE TABLE IF NOT EXISTS donations (
		donation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		donor_id UUID,
		title TEXT NOT NULL,
		description TEXT,
		quantity INT,
		is_available BOOLEAN DEFAULT TRUE,
		pickup_time TIMESTAMPTZ,
		expiry_time TIMESTAMPTZ,

		FOREIGN KEY (donor_id) REFERENCES users(user_id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS distributions (
		distribution_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		donation_id      UUID NOT NULL,
		recipient_id     UUID NOT NULL,
		delivery_status  TEXT,
		delivered_at     TIMESTAMPTZ,
		pickup_confirmed BOOLEAN NOT NULL,
		
		FOREIGN KEY (donation_id) REFERENCES donations(donation_id) ON DELETE CASCADE,
		FOREIGN KEY (recipient_id)	REFERENCES users(user_id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS feedbacks (
		feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		distribution_id UUID NOT NULL,
		user_id UUID NOT NULL,
		rating INT,
		comments TEXT,
		created_at TIMESTAMPTZ,

		FOREIGN KEY (distribution_id) REFERENCES distributions(distribution_id) ON DELETE CASCADE,
		FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
	); 
`

const adminQuery = `INSERT INTO users (username,email,hashed_password,user_type)
										SELECT $1,$2,$3,$4
										WHERE NOT EXISTS (
										SELECT 1 FROM users WHERE username = $1
										AND email = $2
										AND user_type = $4
										);`

var db *sqlx.DB

func Client() *sqlx.DB {
	return db
}

func Connect() {
	var err error

	dsn := os.Getenv("DSN")
	if dsn == "" {
		log.Fatalf("unable to load env:%v", err)
	}

	db, err = sqlx.Connect("postgres", dsn)
	if err != nil {
		log.Fatalf("unable to connect to database:%v", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatalf("unable to ping the database:%v", err)
	}

	db.MustExec(schema)

	hashedPass, err := utils.GetPasswordHash("admin123")
	if err != nil {
		log.Fatalf("unable to generate password hash")
	}
	_, err = db.Exec(adminQuery, "admin", "admin@gmail.com", hashedPass, "admin")
	if err != nil {
		log.Fatalf("unable to create admin user")
	}
	log.Println("successfully connected to the database")
}
