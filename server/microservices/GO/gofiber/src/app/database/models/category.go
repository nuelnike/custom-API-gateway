package model

import (
	"html"
	"strings"
	"time"
	// "github.com/google/uuid"
)

//Category model
type Category struct {
	ID     					int32 						`json:"id" gorm:"primary_key;auto_increment;not_null;"`
	Name     				string    				`json:"name" gorm:"type:varchar(20);not null;unique"`
	CreatedAt  			time.Time   			`gorm:"column:created_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP;" json:"created_at"`
	UpdatedAt  			time.Time   			`gorm:"column:updated_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP;" json:"updated_at"`
}

//Prepare Category for insert
func (b *Category) Prepare() {
	b.Name = html.EscapeString(strings.TrimSpace(b.Name))
}

func (Category) TableName() string {
  return "categories"
}