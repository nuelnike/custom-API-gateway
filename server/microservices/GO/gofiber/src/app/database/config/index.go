package db

import (
	"database/sql"
	"log"
	"time"
	model "gofiber/src/app/database/models"
	mixin "gofiber/src/app/utility/mixins"
	"github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Declare the variable for the database
var DB *gorm.DB
var Db *sql.DB

// ConnectDB connect to db
func ConnectDB() {
	var err error

	dbURL, _ := pq.ParseURL(mixin.Config("DATABASE_URL"))
	DB, err = gorm.Open(postgres.Open(dbURL))

	if err != nil {
		panic("failed to connect database! " + err.Error())
	}

	Db, err = DB.DB()

	if err != nil {
		panic("failed to get database sql db! " + err.Error())
	}

	Db.SetMaxOpenConns(25)
	Db.SetMaxIdleConns(25)
	Db.SetConnMaxLifetime(time.Hour)

	//Migrate the database tables
	go MigrateDatabase()

	log.Println("DB connection successful")
}

func MigrateDatabase() {
	DB.AutoMigrate(
		&model.Cart{},
		&model.Status{},
		&model.Category{},
		&model.City{},
		&model.Country{},
		&model.DeliveryType{},
		&model.Discount{},
		&model.Order{},
		&model.Product{},
		&model.Session{},
		&model.State{},
		&model.User{},
	)
	log.Println("DB table migrations successful")
}