package service

import "estore-server/models"

// ProductService exposes product CRUD operations
type ProductService interface {
	CreateProduct(userID uint, name, description string, price int) (*models.Product, error)
	GetProduct(productID uint) (*models.Product, error)
	UpdateProduct(productID uint, name, description string, price int) (*models.Product, error)
	DeleteProduct(productID uint) error
	SearchProducts(keyword string) ([]models.Product, error)
}
