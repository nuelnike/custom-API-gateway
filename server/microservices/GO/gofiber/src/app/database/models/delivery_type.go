package model

import (
	"time"
)

//DeliveryType model
type DeliveryType struct {
	ID     					int32 				`json:"id" gorm:"primary_key;auto_increment;not_null;"`
	Name     				string    		`json:"name" gorm:"type:varchar(20);not null;unique"`
	CreatedAt  			time.Time     `gorm:"column:created_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP;<-:create" json:"created_at"`
	UpdatedAt  			time.Time     `gorm:"column:updated_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (DeliveryType) TableName() string {
  return "delivery_types"
}