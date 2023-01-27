package model

import (
	"time"
)

//Discount model
type Discount struct {
	ID     					int32 				`json:"id" gorm:"primary_key;auto_increment;not_null;"`
	Typ     				string    		`json:"typ" gorm:"type:varchar(20);"`
	Rate     				int    				`json:"rate" gorm:"type:integer;"`
	CapAmount     	int    				`json:"cap_amount" gorm:"type:integer;"`
	CreatedAt  			time.Time     `gorm:"column:created_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP;<-:create" json:"created_at"`
	UpdatedAt  			time.Time     `gorm:"column:updated_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP" json:"updated_at"`
}

//Prepare Discount for insert
// func (b *Discount) Prepare() {
// 	b.Name = html.EscapeString(strings.TrimSpace(b.Name))
// }

func (Discount) TableName() string {
  return "discounts"
}