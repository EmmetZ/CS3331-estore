package impl

import (
	"context"
	"errors"

	"estore-server/models"
	"estore-server/service"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserServiceImpl struct {
	DB *gorm.DB
}

var _ service.UserService = (*UserServiceImpl)(nil) // Ensure UserService implements UserServiceInterface

func NewUserServiceImpl(db *gorm.DB) *UserServiceImpl {
	return &UserServiceImpl{
		DB: db,
	}
}

// RegisterUser creates a new user with encrypted password
func (s *UserServiceImpl) RegisterUser(username, password string, isAdmin bool) (*models.User, error) {
	// Check if user already exists
	ctx := context.Background()

	_, err := gorm.G[models.User](s.DB).Where("username = ?", username).First(ctx)
	if err == nil {
		return nil, errors.New("username already exists")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	// Create user
	user := &models.User{
		Username: username,
		IsAdmin:  isAdmin,
		UserAuth: models.UserAuth{
			Password: string(hashedPassword),
		},
	}

	err = gorm.G[models.User](s.DB).Create(ctx, user)

	if err != nil {
		return nil, errors.New("failed to create user")
	}

	return user, nil
}

// GetUser retrieves user by ID
func (s *UserServiceImpl) GetUser(userID uint) (*models.User, error) {
	ctx := context.Background()
	user, err := gorm.G[models.User](s.DB).Where("id = ?", userID).First(ctx)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

// GetAllUsers retrieves all users (for admins only)
func (s *UserServiceImpl) GetAllUsers() ([]models.User, error) {
	ctx := context.Background()
	users, err := gorm.G[models.User](s.DB).Find(ctx)

	if err != nil {
		return nil, err
	}

	return users, nil
}

// UpdateUser updates user information
func (s *UserServiceImpl) UpdateUser(userID uint, username string) (*models.User, error) {
	ctx := context.Background()
	user, err := gorm.G[models.User](s.DB).Where("id = ?", userID).First(ctx)
	if err != nil {
		return nil, err
	}

	// Update user
	user.Username = username

	_, err = gorm.G[models.User](s.DB).Updates(ctx, user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// UpdateUserPassword updates user's password
func (s *UserServiceImpl) UpdateUserPassword(userID uint, oldPassword, newPassword string) error {
	ctx := context.Background()
	userAuth, err := gorm.G[models.UserAuth](s.DB).Where("id = ?", userID).First(ctx)
	if err != nil {
		return err
	}

	// Verify old password
	if err := bcrypt.CompareHashAndPassword([]byte(userAuth.Password), []byte(oldPassword)); err != nil {
		return errors.New("incorrect old password")
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("failed to hash password")
	}

	// Update password
	userAuth.Password = string(hashedPassword)
	_, err = gorm.G[models.UserAuth](s.DB).Updates(ctx, userAuth)
	if err != nil {
		return err
	}

	return nil
}

// DeleteUser deletes a user by ID
func (s *UserServiceImpl) DeleteUser(userID uint) error {
	ctx := context.Background()
	if _, err := gorm.G[models.UserAuth](s.DB).Where("id = ?", userID).Delete(ctx); err != nil {
		return err
	}
	return nil
}
