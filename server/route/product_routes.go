package route

import (
	"estore-server/controller"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ProductRoutesModule wires product endpoints into the router
type ProductRoutesModule struct {
	controller *controller.ProductController
}

func NewProductRoutesModule(db *gorm.DB) *ProductRoutesModule {
	return &ProductRoutesModule{
		controller: controller.NewProductController(db),
	}
}

func (prm *ProductRoutesModule) RegisterPublicRoutes(group *gin.RouterGroup) {}

func (prm *ProductRoutesModule) RegisterUserRoutes(group *gin.RouterGroup) {
	group.GET("/product", prm.controller.SearchProducts)
	group.GET("/product/:id", prm.controller.GetProductByID)
	group.POST("/product", prm.controller.CreateProduct)
	group.PUT("/product/:id", prm.controller.UpdateProduct)
	group.DELETE("/product/:id", prm.controller.DeleteProduct)
}

func (prm *ProductRoutesModule) RegisterAdminRoutes(group *gin.RouterGroup) {
	group.GET("/product", prm.controller.SearchProducts)
	group.PUT("/product/:id", prm.controller.UpdateProduct)
	group.DELETE("/product/:id", prm.controller.DeleteProduct)
}

var _ RouteModule = (*ProductRoutesModule)(nil)
