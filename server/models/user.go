package models

// User represents the user in the system
type User struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Username string `json:"username" gorm:"not null;unique"`
	Email    string `json:"email" gorm:"not null"`
	Phone    string `json:"phone"`
	Address  string `json:"address"`
	IsAdmin  bool   `json:"is_admin" gorm:"not null;default:false"`

	// One-to-one relationship with UserAuth (shared primary key)
	UserAuth UserAuth `json:"-" gorm:"foreignKey:ID;references:ID;constraint:OnDelete:CASCADE;OnUpdate:CASCADE"`

	// One-to-many relationship with Product
	Products []Product `json:"products,omitempty" gorm:"foreignKey:UserID"`
}

// UserAuth stores user authentication information
type UserAuth struct {
	ID       uint   `json:"id" gorm:"primaryKey;autoIncrement:false"`
	Password string `json:"-" gorm:"not null;size:255"` // Password will be stored as hashed value

	User     *User  `json:"-" gorm:"constraint:OnDelete:CASCADE;OnUpdate:CASCADE;foreignKey:ID;references:ID"`
}
