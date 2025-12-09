package controller

import (
	"errors"
	"net/http"

	"estore-server/dto"
	"estore-server/models"
	"estore-server/service"
	"estore-server/service/impl"
	"estore-server/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ProductController coordinates product-related handlers
type ProductController struct {
	ProductService service.ProductService
}

func NewProductController(db *gorm.DB) *ProductController {
	return &ProductController{
		ProductService: impl.NewProductServiceImpl(db),
	}
}

// SearchProducts retrieves products filtered by optional keyword across name and description
func (pc *ProductController) SearchProducts(c *gin.Context) {
	keyword := c.Query("q")
	products, err := pc.ProductService.SearchProducts(keyword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse(http.StatusInternalServerError, err.Error()))
		return
	}

	responses := productsToResponse(products)
	c.JSON(http.StatusOK, dto.NewSuccessResponse(http.StatusOK, responses, "Products retrieved successfully"))
}

// CreateProduct lets an authenticated user add a product under their account
func (pc *ProductController) CreateProduct(c *gin.Context) {
	var req dto.CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse(http.StatusBadRequest, "Invalid request payload"))
		return
	}

	user, err := utils.GetUserFromCtx(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, dto.NewErrorResponse(http.StatusUnauthorized, "Unauthorized"))
		return
	}

	product, err := pc.ProductService.CreateProduct(user.ID, req.Name, req.Desc, req.Price)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse(http.StatusInternalServerError, err.Error()))
		return
	}

	c.JSON(http.StatusCreated, dto.NewSuccessResponse(http.StatusCreated, ProductResponseFromModel(product), "Product created successfully"))
}

// UpdateProduct lets owners update their items while also granting admins override access
func (pc *ProductController) UpdateProduct(c *gin.Context) {
	productID, err := utils.ParseUintParam(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse(http.StatusBadRequest, "Invalid product ID"))
		return
	}

	requester, err := utils.GetUserFromCtx(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, dto.NewErrorResponse(http.StatusUnauthorized, "Unauthorized"))
		return
	}

	product, err := pc.ProductService.GetProduct(productID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, dto.NewErrorResponse(http.StatusNotFound, "Product not found"))
			return
		}
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse(http.StatusInternalServerError, err.Error()))
		return
	}

	if !requester.IsAdmin && product.UserID != requester.ID {
		c.JSON(http.StatusForbidden, dto.NewErrorResponse(http.StatusForbidden, "Unauthorized to modify this product"))
		return
	}

	var req dto.UpdateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse(http.StatusBadRequest, "Invalid request payload"))
		return
	}

	updatedProduct, err := pc.ProductService.UpdateProduct(productID, req.Name, req.Desc, req.Price)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, dto.NewErrorResponse(http.StatusNotFound, "Product not found"))
			return
		}
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse(http.StatusInternalServerError, err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(http.StatusOK, ProductResponseFromModel(updatedProduct), "Product updated successfully"))
}

// DeleteProduct allows owners or admins to remove products
func (pc *ProductController) DeleteProduct(c *gin.Context) {
	productID, err := utils.ParseUintParam(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse(http.StatusBadRequest, "Invalid product ID"))
		return
	}

	requester, err := utils.GetUserFromCtx(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, dto.NewErrorResponse(http.StatusUnauthorized, "Unauthorized"))
		return
	}

	product, err := pc.ProductService.GetProduct(productID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, dto.NewErrorResponse(http.StatusNotFound, "Product not found"))
			return
		}
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse(http.StatusInternalServerError, err.Error()))
		return
	}

	if !requester.IsAdmin && product.UserID != requester.ID {
		c.JSON(http.StatusForbidden, dto.NewErrorResponse(http.StatusForbidden, "Unauthorized to delete this product"))
		return
	}

	if err := pc.ProductService.DeleteProduct(productID); err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse(http.StatusInternalServerError, err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(http.StatusOK, nil, "Product deleted successfully"))
}

// ProductResponseFromModel maps a Product model into a response DTO.
func ProductResponseFromModel(product *models.Product) dto.ProductResponse {
	return dto.ProductResponse{
		ID:    product.ID,
		Name:  product.Name,
		Desc:  product.Desc,
		Price: product.Price,
	}
}

func productsToResponse(products []models.Product) []dto.ProductResponse {
	responses := make([]dto.ProductResponse, 0, len(products))
	for i := range products {
		responses = append(responses, ProductResponseFromModel(&products[i]))
	}
	return responses
}
