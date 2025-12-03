package service

import (
	"estore-server/models"
)

// UserService defines the interface for user-related operations
type UserService interface {
	RegisterUser(username, password string, isAdmin bool) (*models.User, error)
	GetUser(userID uint) (*models.User, error)
	GetAllUsers() ([]models.User, error)
	UpdateUser(userID uint, username string) (*models.User, error)
	UpdateUserPassword(userID uint, oldPassword, newPassword string) error
	DeleteUser(userID uint) error
}
