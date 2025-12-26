package service

import "github.com/gin-gonic/gin"

type AuthService interface {
	LoginAuthenticator(c *gin.Context) (any, error)
	RegisterUser(username, email, password string) error
}