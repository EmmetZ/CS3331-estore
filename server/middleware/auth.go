package middleware

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"estore-server/dto"
	"estore-server/models"
	"estore-server/service/impl"

	ginjwt "github.com/appleboy/gin-jwt/v3"
	"github.com/appleboy/gin-jwt/v3/core"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

const IdentityKey = "user"

func AuthMiddleware(db *gorm.DB) *ginjwt.GinJWTMiddleware {
	authMiddleware, err := ginjwt.New(initParams(db))
	if err != nil {
		log.Fatal("Auth Middleware Error:" + err.Error())
	}
	errInit := authMiddleware.MiddlewareInit()

	if errInit != nil {
		log.Fatal("Auth Middleware Init Error:" + errInit.Error())
	}

	return authMiddleware
}

func initParams(db *gorm.DB) *ginjwt.GinJWTMiddleware {
	authService := impl.NewAuthServiceImpl(db)

	return &ginjwt.GinJWTMiddleware{
		Key:             []byte(getKey()),
		Timeout:         time.Hour,
		MaxRefresh:      time.Hour * 24 * 7,
		Authenticator:   authService.LoginAuthenticator,
		Unauthorized:    unauthorized,
		PayloadFunc:     payloadFunc,
		LogoutResponse:  logoutResponse,
		IdentityHandler: identityHandler,
		Authorizer:      authorizator,
		LoginResponse:   loginResponse,
		IdentityKey:     IdentityKey,
		RefreshResponse: refreshResponse,

		TimeFunc: time.Now,
	}
}

func getKey() string {
	key := os.Getenv("JWT_SECRET")
	if key == "" {
		log.Fatal("JWT_SECRET environment variable is required")
	}
	return key
}

func unauthorized(c *gin.Context, code int, message string) {
	c.JSON(code, dto.NewErrorResponse(code, message))
}

func payloadFunc(data any) jwt.MapClaims {
	if user, ok := data.(*models.User); ok {
		return jwt.MapClaims{
			"user_id":  user.ID,
			"is_admin": user.IsAdmin,
		}
	}
	return jwt.MapClaims{}
}

func identityHandler(c *gin.Context) any {
	claims := ginjwt.ExtractClaims(c)
	return &models.User{
		ID:      uint(claims["user_id"].(float64)),
		IsAdmin: claims["is_admin"].(bool),
	}
}

func authorizator(c *gin.Context, data any) bool {
	if user, ok := data.(*models.User); ok {
		// admin routes include "/admin/"
		path := c.Request.URL.Path
		if strings.Contains("/admin/", path) {
			return user.IsAdmin
		}

		return user.ID != 0
	}
	return false
}

func logoutResponse(c *gin.Context) {
	c.JSON(http.StatusOK, dto.NewSuccessResponse(http.StatusOK, nil, "Successfully logged out"))
}

func loginResponse(c *gin.Context, token *core.Token) {
	response := gin.H{
		"access_token": token.AccessToken,
		"token_type":   token.TokenType,
		"expires_in":   token.ExpiresIn(),
	}

	// Include refresh token if present
	if token.RefreshToken != "" {
		response["refresh_token"] = token.RefreshToken
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(http.StatusOK, response, "Login successful"))
}

func refreshResponse(c *gin.Context, token *core.Token) {
	response := gin.H{
		"access_token": token.AccessToken,
		"token_type":   token.TokenType,
		"expires_in":   token.ExpiresIn(),
	}

	// Include refresh token if present
	if token.RefreshToken != "" {
		response["refresh_token"] = token.RefreshToken
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(http.StatusOK, response, "Token refreshed successfully"))
}