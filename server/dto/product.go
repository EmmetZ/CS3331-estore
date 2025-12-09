package dto

// CreateProductRequest represents the payload for creating a product
type CreateProductRequest struct {
	Name  string `json:"name" binding:"required"`
	Desc  string `json:"description" binding:"omitempty"`
	Price int    `json:"price" binding:"required,gte=0"`
}

// UpdateProductRequest represents the payload for updating a product
// Fields mirror CreateProductRequest to keep validation consistent
type UpdateProductRequest struct {
	Name  string `json:"name" binding:"required"`
	Desc  string `json:"description" binding:"omitempty"`
	Price int    `json:"price" binding:"required,gte=0"`
}

// ProductResponse represents product data returned to clients
type ProductResponse struct {
	ID     uint   `json:"id"`
	Name   string `json:"name"`
	Desc   string `json:"description"`
	Price  int    `json:"price"`
}
