package utils

import (
	"errors"
	"strconv"

	"estore-server/middleware"
	"estore-server/models"

	"github.com/gin-gonic/gin"
)

var (
	errIdentityMissing = errors.New("identity missing from context")
	errIdentityInvalid = errors.New("identity is not a user model")
)

// ParseUintParam converts a numeric path parameter to uint for DB lookups.
func ParseUintParam(param string) (uint, error) {
	value, err := strconv.ParseUint(param, 10, 32)
	if err != nil {
		return 0, err
	}
	return uint(value), nil
}

// GetUserFromCtx extracts the authenticated user from Gin context.
func GetUserFromCtx(c *gin.Context) (*models.User, error) {
	claims, exists := c.Get(middleware.IdentityKey)
	if !exists {
		return nil, errIdentityMissing
	}

	user, ok := claims.(*models.User)
	if !ok {
		return nil, errIdentityInvalid
	}

	return user, nil
}
