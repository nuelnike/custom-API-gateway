package model

import (
	"gofiber/src/app/utility/security"
	"github.com/google/uuid"
	"html"
	"strings"
	"time"
)

//User struct
type User struct {
		ID     				string 				`json:"id" gorm:"type:varchar(50);primary_key"`
    StatusID 			int32 				`gorm:"null" json:"status_id"`
    Status   			Status        `gorm:"foreignKey:StatusID;constraint:OnUpdate:CASCADE,ONDELETE:SET NULL;"`
    CityID 				int32 				`gorm:"null" json:"city_id"`
    City   				City          `gorm:"foreignKey:CityID;constraint:OnUpdate:CASCADE,ONDELETE:RESTRICT;"`
    StateID 			int32 				`gorm:"null" json:"state_id"`
    State   			State         `gorm:"foreignKey:StateID;constraint:OnUpdate:CASCADE,ONDELETE:RESTRICT;"`
    CountryID 		int32 				`gorm:"null" json:"country_id"`
    Country   		Country       `gorm:"foreignKey:CountryID;constraint:OnUpdate:CASCADE,ONDELETE:RESTRICT;"`
    Username 			string 				`gorm:"type:varchar(20);not null;unique" json:"username"`
    Surname 			string 				`gorm:"type:varchar(50);not null" json:"surname"`
    Firstname 		string 				`gorm:"type:varchar(50);not null" json:"firstname"`
    Othername 		string 				`gorm:"type:varchar(50); null" json:"othername"`
    Email 				string 				`gorm:"type:varchar(50);not null;unique" json:"email"`
    Password 			string 				`gorm:"not null" json:"password"`
    Phone 				string 				`gorm:"type:varchar(20); not null" json:"phone"`
    DOB 					string 				`gorm:"type:varchar(15); null" json:"dob"`
    Address 			string 				`gorm:"type:varchar(50); not null;" json:"address"`
    Photo 				string 				`gorm:"null;type:varchar(50)" json:"photo"`
    Gender 				string 				`gorm:"null;type:varchar(10)" json:"gender"`
    CreatedAt 		time.Time 		`gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
    UpdatedAt 		time.Time 		`gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

//Prepare user
func (u *User) Prepare() {

	if u.Surname != "" {
		u.Surname = html.EscapeString(strings.TrimSpace(u.Surname))
	}

	if u.Firstname != "" {
		u.Firstname = html.EscapeString(strings.TrimSpace(u.Firstname))
	}

	if u.Othername != "" {
		u.Othername = html.EscapeString(strings.TrimSpace(u.Othername))
	}

	if u.Email != "" {
		u.Email = html.EscapeString(strings.TrimSpace(u.Email))
	}

	if u.Password != "" {
		u.Password = html.EscapeString(strings.TrimSpace(u.Password))
	}

	if u.Username != "" {
		u.Username = html.EscapeString(strings.TrimSpace(u.Username))
	}

	// if u.Photo.URL != "" {
	// 	u.Photo.URL = html.EscapeString(strings.TrimSpace(u.Photo.URL))
	// }

	// if u.Photo.DominantColor != "" {
	// 	u.Photo.DominantColor = html.EscapeString(strings.TrimSpace(u.Photo.DominantColor))
	// }

	// if u.Country != "" {
	// 	u.Country = html.EscapeString(strings.TrimSpace(u.Country))
	// }

	// if u.About != "" {
	// 	u.About = html.EscapeString(strings.TrimSpace(u.About))
	// }

	// if len(u.AccessRoles) > 0 {
	// 	for k, v := range u.AccessRoles {
	// 		u.AccessRoles[k] = html.EscapeString(strings.TrimSpace(v))
	// 	}
	// }
}

//BeforeInsert user
func (u *User) BeforeInsert() error {
	// Add a uuid to the user
	u.ID = uuid.NewString()
	// u.SystemStatus = mixin.SystemActive //either of "active", "banned" or "deleted"

	//sanitize blog before insert to db
	u.Prepare()

	//only hash password if available. user could be login in using google or facebook
	//in which case no password is present
	if u.Password != "" {
		//hash user password
		hashedPassword, err := security.EncryptPassword(u.Password)
		if err != nil {
			return err
		}
		u.Password = string(hashedPassword)
	}

	return nil
}

func (User) TableName() string {
  return "users"
}