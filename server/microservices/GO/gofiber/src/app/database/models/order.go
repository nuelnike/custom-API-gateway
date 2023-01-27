package model

import (
	"time"
	"gorm.io/gorm"
	// mixin "gofiber/src/app/utility/mixins"
	"github.com/google/uuid"
)

//Order model
type Order struct {
	ID     					int32 				`json:"id" gorm:"primary_key;auto_increment;not_null;"`
	InvoiceNo     	string    		`json:"invoice_no" gorm:"type:varchar(100);unique"`
	UserID     			string    		`json:"user_id"`
	User   					User        	`gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,ONDELETE:RESTRICT;"`
	StatusID 				int32        	`gorm:"null" json:"status_id"`
	Status   				Status        `gorm:"foreignKey:StatusID;constraint:OnUpdate:CASCADE,ONDELETE:SET NULL;"`
	DeliveryTypeID 	int32        	`json:"delivery_type_id"`
	DeliveryType   	DeliveryType  `gorm:"foreignKey:DeliveryTypeID;constraint:OnUpdate:CASCADE,ONDELETE:SET NULL;"`
	ShippingCost    int    				`json:"shipping_cost" gorm:"type:integer;"`
	SubAmount     	int    				`json:"sub_amount" gorm:"type:integer;"`
	DiscountAmount  int    				`json:"discount_amount" gorm:"type:integer;"`
	TotalAmount   	int    				`json:"total_amount" gorm:"type:integer;"`
	Cart 						[]Cart 				`json:"cart" form:"cart"`
	CreatedAt  			time.Time     `gorm:"column:created_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP;<-:create" json:"created_at"`
	UpdatedAt  			time.Time     `gorm:"column:updated_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (u *Order) BeforeCreate(tx *gorm.DB) (err error) {

  u.InvoiceNo = uuid.NewString();
  // u.TotalAmount = u.SubAmount + u.ShippingCost - u.DiscountAmount;

  return

}

// func (u *Order) BeforeUpdate(tx *gorm.DB) (err error) {
  
//   if u.UserID == "" {
// 		return c.JSON(fiber.Map{"success": false, "code": 500, "message": "user id cannot be empty"})
//   }
//   return
  
// }


func (Order) TableName() string {
  return "orders"
}