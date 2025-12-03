package route

import (
	jwt "github.com/appleboy/gin-jwt/v3"
	"github.com/gin-gonic/gin"
)

type AuthRoutesModule struct {
	middleware *jwt.GinJWTMiddleware
}

func NewAuthRoutesModule(middleware *jwt.GinJWTMiddleware) *AuthRoutesModule {
	return &AuthRoutesModule{middleware}
}

func (arm *AuthRoutesModule) RegisterPublicRoutes(group *gin.RouterGroup) {
	group.POST("/login", arm.middleware.LoginHandler)
	group.POST("/refresh", arm.middleware.RefreshHandler)
}

func (arm *AuthRoutesModule) RegisterUserRoutes(group *gin.RouterGroup) {
	group.POST("/logout", arm.middleware.LogoutHandler)
}

func (arm *AuthRoutesModule) RegisterAdminRoutes(group *gin.RouterGroup) {
	// No admin-specific routes for auth
}

var _ RouteModule = (*AuthRoutesModule)(nil)
