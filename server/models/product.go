package models

type Product struct {
	ID        uint   `json:"id" gorm:"primaryKey;autoIncrement"`
	Name      string `json:"name"`
	Desc      string `json:"description"`
	Price     int    `json:"price" gorm:"not null"`
	CreatedAt int64  `json:"created_at" gorm:"autoCreateTime"`

	// Many-to-one relationship with User
	UserID uint `json:"user_id" gorm:"not null"`
	User   User `json:"user" gorm:"foreignKey:UserID;references:ID"`
}
