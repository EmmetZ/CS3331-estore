package dto

import "estore-server/models"

// CreateProductRequest represents the payload for creating a product
type CreateProductRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description" binding:"omitempty"`
	Price       int    `json:"price" binding:"required,gte=0"`
}

// UpdateProductRequest represents the payload for updating a product
// Fields mirror CreateProductRequest to keep validation consistent
type UpdateProductRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description" binding:"omitempty"`
	Price       int    `json:"price" binding:"required,gte=0"`
}

// Seller represents basic seller info
type Seller struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Address  string `json:"address"`
}

// ProductResponse represents product data returned to clients
type ProductResponse struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Price       int    `json:"price"`
	Seller      Seller `json:"seller"`
}

func NewProductResponse(product *models.Product) ProductResponse {
	seller := Seller{}
	if product.User.ID != 0 {
		seller = Seller{
			ID:       product.User.ID,
			Username: product.User.Username,
			Email:    product.User.Email,
			Phone:    product.User.Phone,
			Address:  product.User.Address,
		}
	}

	return ProductResponse{
		ID:          product.ID,
		Name:        product.Name,
		Description: product.Description,
		Price:       product.Price,
		Seller:      seller,
	}
}
