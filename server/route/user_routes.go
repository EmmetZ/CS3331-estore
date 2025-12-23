package route

import (
	"estore-server/controller"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// UserRoutesModule handles user-related route registration
type UserRoutesModule struct {
	controller *controller.UserController
}

func NewUserRoutesModule(db *gorm.DB) *UserRoutesModule {
	controller := controller.NewUserController(db)
	return &UserRoutesModule{controller}
}

func (urm *UserRoutesModule) RegisterPublicRoutes(group *gin.RouterGroup) {
	group.POST("/register", urm.controller.Register)
}

func (urm *UserRoutesModule) RegisterUserRoutes(group *gin.RouterGroup) {
	// Current user routes
	group.GET("/user/me", urm.controller.GetMe)

	// Regular user updates their own information via JWT context
	group.PUT("/user/me", urm.controller.UpdateUser)
	group.PUT("/user/:id/password", urm.controller.UpdateUserPassword)

	group.GET("/user/:id", urm.controller.GetUser)
}

func (urm *UserRoutesModule) RegisterAdminRoutes(group *gin.RouterGroup) {
	// User management routes (admin only)
	group.GET("/user", urm.controller.GetAllUsers)
	group.DELETE("/user/:id", urm.controller.DeleteUser)
}

var _ RouteModule = (*UserRoutesModule)(nil)
