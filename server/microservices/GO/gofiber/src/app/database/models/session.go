package model

import (
	"time"
)

//Session model
type Session struct {
	Token 					string        `json:"token" gorm:"type:varchar(25);primary_key"`
	UserID     			string    		`json:"users_id"`
	User   					User        	`gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,ONDELETE:RESTRICT;"`
	StatusID 				int32        	`json:"status_id"`
	Status   				Status        `gorm:"foreignKey:StatusID;constraint:OnUpdate:CASCADE,ONDELETE:SET NULL;"`
	Duration				string 				`json:"duration" gorm:"type:varchar(30);"`
	CreatedAt  			time.Time     `gorm:"column:created_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP;<-:create" json:"created_at"`
	UpdatedAt  			time.Time     `gorm:"column:updated_at;not null;type:TIMESTAMP;default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (Session) TableName() string {
  return "session"
}