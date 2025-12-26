package impl

import (
	"context"
	"errors"
	"estore-server/dto"
	"estore-server/models"
	"estore-server/service"

	ginjwt "github.com/appleboy/gin-jwt/v3"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthServiceImpl struct {
	DB *gorm.DB
}

var _ service.AuthService = (*AuthServiceImpl)(nil) // Ensure AuthService implements AuthService interface

func NewAuthServiceImpl(db *gorm.DB) *AuthServiceImpl {
	return &AuthServiceImpl{
		DB: db,
	}
}

func (s *AuthServiceImpl) LoginAuthenticator(c *gin.Context) (any, error) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return nil, ginjwt.ErrMissingLoginValues
	}

	username, password := req.Username, req.Password

	// Find user by username with associated UserAuth
	ctx := context.Background()
	user, err := gorm.G[models.User](s.DB).Preload("UserAuth", nil).Where("username = ?", username).First(ctx)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	// Compare password with hashed password
	if err := bcrypt.CompareHashAndPassword([]byte(user.UserAuth.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid username or password")
	}

	return &user, nil
}

// RegisterUser creates a new user with encrypted password
func (s *AuthServiceImpl) RegisterUser(username, email, password string) error {
	// Check if user already exists
	ctx := context.Background()

	_, err := gorm.G[models.User](s.DB).Where("username = ?", username).First(ctx)
	if err == nil {
		return errors.New("username already exists")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("failed to hash password")
	}

	user := &models.User{
		Username: username,
		Email:    email,
		IsAdmin:  false,
		UserAuth: models.UserAuth{
			Password: string(hashedPassword),
		},
	}
	err = s.DB.Transaction(func(tx *gorm.DB) error {
		if err := gorm.G[models.User](tx).Create(ctx, user); err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return err
	}

	return nil
}
