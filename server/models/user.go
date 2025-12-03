package models

// User represents the user in the system
type User struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Username string `json:"username" gorm:"not null;unique;size:100"`
	IsAdmin  bool   `json:"is_admin" gorm:"not null;default:false"`

	// One-to-one relationship with UserAuth
	UserAuth UserAuth `json:"-" gorm:"foreignKey:ID;constraint:OnDelete:CASCADE;OnUpdate:CASCADE"`
}

// UserAuth stores user authentication information

type UserAuth struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Password string `json:"-" gorm:"not null;size:255"` // Password will be stored as hashed value
}
