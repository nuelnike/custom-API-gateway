package model

import (
	// db "gofiber/src/app/database/config"
	"github.com/google/uuid"
	"html"
	"strings"
	"time"
	"gorm.io/gorm"
	"fmt"
)

//Product model
type Product struct {
	ID     					string 								`json:"id,omitempty" gorm:"type:varchar(50);primary_key"`
	Name 						string						 		`json:"name" gorm:"type:varchar(20);unique"`
	Price      			int 									`json:"price" gorm:"type:integer;"`
	DiscountID 			int32                	`json:"discount_id" gorm:"null"`
	Discount   			Discount             	`gorm:"foreignKey:DiscountID;constraint:OnUpdate:CASCADE,ONDELETE:SET NULL;"`
	StatusID 				int32                	`json:"status_id" gorm:"null"`
	Status   				Status              	`gorm:"foreignKey:StatusID;constraint:OnUpdate:CASCADE,ONDELETE:SET NULL;"`
	CategoryID 			int32                	`json:"category_id" gorm:"null"`
	Category   			Category             	`gorm:"foreignKey:CategoryID;constraint:OnUpdate:CASCADE,ONDELETE:SET NULL;"`
	Description     string                `json:"description" gorm:"null"`
	Instock     		int                   `json:"instock" gorm:"type:integer;"`
	OrderCount      int                   `json:"order_count" gorm:"type:integer;"`
	Image     			string                `json:"image" gorm:"null;type:smallText"`
	// Tags       			interfaces.DataJSONBString    		`json:"tags,omitempty" gorm:"type:JSONB NOT NULL DEFAULT '[]'::JSONB"`
	CreatedAt  			time.Time             `gorm:"column:created_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP;<-:create" json:"created_at"`
	UpdatedAt  			time.Time             `gorm:"column:updated_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP" json:"updated_at"`
}

type Products []*Product

func (u *Product) BeforeCreate(tx *gorm.DB) (err error) {

  u.ID = uuid.NewString();

  u.OrderCount = 0
	u.Instock = 0
	if u.Name == "" { 
		fmt.Println("product name cannot be empty")
		return
  }else{
		u.Name = html.EscapeString(strings.TrimSpace(u.Name))
  }

	if (u.Instock > 0) {
		u.StatusID = 10;
    return
  }else{
  	u.StatusID = 11;
  }

	if (u.Price < 1) {
		fmt.Println("product price cannot be empty")
		return
  }

	if (u.CategoryID < 1) {
		
		fmt.Println("product category cannot be empty")
		return
  }

	// a.Name = blm.BlueMonday.Sanitize(a.Name)
	// a.Description = blm.BlueMonday.Sanitize(a.Description)

	// if len(u.Tags) > 0 {
	// 	for k, v := range u.Tags {
	// 		u.Tags[k] = html.EscapeString(strings.TrimSpace(v))
	// 	}
	// }
  return

}

func (u *Product) Prepare() {
	if (u.Instock > 0) {
		u.StatusID = 10;
    return
  }else{
  	u.StatusID = 11;
  }

	u.Name = html.EscapeString(strings.TrimSpace(u.Name))
  return
}

func (u *Product) Restock(x int) {
	u.Instock += x;
  return
}

// func FindSingleProduct(Id string) *Product {
// 	db := db.DB
// 	var product *Product
// 	db.Where(Product{ID: Id}).Find(&product)
// 	return product
// }

// func (b *Product) Insert() error {
// 	db := db.DB
// 	return db.Create(&b).Error
// }

// func (b *Product) Update() {
// 	db := db.DB
// 	db.Save(&b)
// }

// func (b *Product) Delete() {
// 	db := db.DB
// 	db.Delete(&b)
// }

//Change table name
func (Product) TableName() string {
  return "products"
}