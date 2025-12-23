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
