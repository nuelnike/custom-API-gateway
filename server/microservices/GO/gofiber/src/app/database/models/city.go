package model

import (
	"html"
	"strings"
	"time"
)

//City model
type City struct {
	ID     					string 				`json:"id,omitempty" gorm:"type:varchar(50);primary_key"`
	StateID 				string        `json:"state_id"`
	State   				State        	`gorm:"foreignKey:StateID;constraint:OnUpdate:CASCADE,ONDELETE:SET NULL;"`
	Name     				string    		`json:"name" gorm:"type:varchar(20);not null;unique"`
	CreatedAt  			time.Time     `gorm:"column:created_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP;<-:create" json:"created_at"`
	UpdatedAt  			time.Time     `gorm:"column:updated_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP" json:"updated_at"`
}

//Prepare City for insert
func (b *City) Prepare() {
	b.Name = html.EscapeString(strings.TrimSpace(b.Name))
}

func (City) TableName() string {
  return "cities"
}
//BeforeInsert for City
// func (b *City) BeforeInsert() {
// 	// b.ID = uuid.NewString()

// 	b.Prepare()
// }