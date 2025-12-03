package route

import (
	"github.com/gin-gonic/gin"

	ginjwt "github.com/appleboy/gin-jwt/v3"
)

// RouteModule defines an interface for modular route registration
type RouteModule interface {
	RegisterPublicRoutes(group *gin.RouterGroup)
	RegisterUserRoutes(group *gin.RouterGroup)
	RegisterAdminRoutes(group *gin.RouterGroup)
}

func RegisterRoutes(r *gin.Engine, routes []RouteModule, handle *ginjwt.GinJWTMiddleware) {
	publicGroup := r.Group("/api")
	userGroup := r.Group("/api")
	adminGroup := r.Group("/api/admin")

	// Apply JWT middleware to user and admin groups
	userGroup.Use(handle.MiddlewareFunc())
	adminGroup.Use(handle.MiddlewareFunc())

	for _, module := range routes {
		module.RegisterPublicRoutes(publicGroup)
		module.RegisterUserRoutes(userGroup)
		module.RegisterAdminRoutes(adminGroup)
	}
}
