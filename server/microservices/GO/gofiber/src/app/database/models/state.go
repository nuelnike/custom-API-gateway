package model

import (
	"html"
	"strings"
	"time"
)

//State model
type State struct {
	ID     					int32 				`json:"id" gorm:"primary_key;auto_increment;not_null;"`
	CountryID 			string          `json:"country_id"`
	Country   			Country 				`gorm:"foreignKey:CountryID;constraint:OnUpdate:CASCADE,ONDELETE:RESTRICT;"`
	Name     				string    			`json:"name" gorm:"type:varchar(20);unique"`
	CreatedAt  			time.Time       `gorm:"column:created_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP;<-:create" json:"created_at"`
	UpdatedAt  			time.Time       `gorm:"column:updated_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP" json:"updated_at"`
}

//Prepare State for insert
func (b *State) Prepare() {
	b.Name = html.EscapeString(strings.TrimSpace(b.Name))
}

func (State) TableName() string {
  return "states"
}