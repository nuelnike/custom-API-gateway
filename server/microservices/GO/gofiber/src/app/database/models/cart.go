package model

import (
	"time"
	"gorm.io/gorm"
)

//Cart model
type Cart struct {
	ID     								int32 				`json:"id" gorm:"primary_key;auto_increment;not_null;"`
	ProductID     				string    		`json:"product_id"`
	Product   						Product       `gorm:"foreignKey:ProductID;constraint:OnUpdate:CASCADE,ONDELETE:RESTRICT;"`
	OrderID     					int32    			`json:"order_id"`
	Order   							Order       	`gorm:"foreignKey:OrderID;constraint:OnUpdate:CASCADE,ONDELETE:RESTRICT;"`
	Price      						int 					`json:"price" gorm:"type:integer;"`
	DiscountAmount 				int     			`json:"discount_amount" gorm:"type:integer;"`
	Quantity      				int           `json:"quantity" gorm:"type:integer;"`
	TotalAmount     			int           `json:"total_amount" gorm:"type:integer;"`
	CreatedAt  						time.Time     `gorm:"column:created_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP;<-:create" json:"created_at"`
	UpdatedAt  						time.Time     `gorm:"column:updated_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP" json:"updated_at"`
}


// type Shop struct {
//     gorm.Model
//     Name      string     `json:"name" gorm:"type:varchar(180);unique_index"`
//     Active    int        `json:"active" gorm:"type:tinyint(1);default:1"`
//     Tags      []Tag      `json:"tags" gorm:"many2many:shops_tags;"`
//     Locations []Location `json:"locations" gorm:"locations"`
// }

// type Tag struct {
//     gorm.Model
//     Name  string `json:"name" gorm:"type:varchar(180)"`
//     Shops []Shop `json:"shops" gorm:"many2many:shops_tags;"`
// }


func (u *Cart) BeforeCreate(tx *gorm.DB) (err error) {

  u.TotalAmount = (u.Price * u.Quantity) - u.DiscountAmount;
  return

}

//Change table name
func (Cart) TableName() string {
  return "cart"
}