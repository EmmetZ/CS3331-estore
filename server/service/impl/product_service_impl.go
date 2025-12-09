package impl

import (
	"context"
	"strings"

	"estore-server/models"
	"estore-server/service"

	"gorm.io/gorm"
)

// ProductServiceImpl provides product persistence operations
type ProductServiceImpl struct {
	DB *gorm.DB
}

var _ service.ProductService = (*ProductServiceImpl)(nil)

func NewProductServiceImpl(db *gorm.DB) *ProductServiceImpl {
	return &ProductServiceImpl{DB: db}
}

func (s *ProductServiceImpl) CreateProduct(userID uint, name, desc string, price int) (*models.Product, error) {
	ctx := context.Background()

	product := &models.Product{
		UserID: userID,
		Name:   name,
		Desc:   desc,
		Price:  price,
	}

	if err := gorm.G[models.Product](s.DB).Create(ctx, product); err != nil {
		return nil, err
	}

	return product, nil
}

func (s *ProductServiceImpl) GetProduct(productID uint) (*models.Product, error) {
	ctx := context.Background()
	product, err := gorm.G[models.Product](s.DB).Where("id = ?", productID).First(ctx)
	if err != nil {
		return nil, err
	}

	return &product, nil
}

func (s *ProductServiceImpl) UpdateProduct(productID uint, name, desc string, price int) (*models.Product, error) {
	ctx := context.Background()
	product, err := gorm.G[models.Product](s.DB).Where("id = ?", productID).First(ctx)
	if err != nil {
		return nil, err
	}

	product.Name = name
	product.Desc = desc
	product.Price = price

	if _, err := gorm.G[models.Product](s.DB).Updates(ctx, product); err != nil {
		return nil, err
	}

	return &product, nil
}

func (s *ProductServiceImpl) DeleteProduct(productID uint) error {
	ctx := context.Background()
	if _, err := gorm.G[models.Product](s.DB).Where("id = ?", productID).Delete(ctx); err != nil {
		return err
	}
	return nil
}

func (s *ProductServiceImpl) SearchProducts(keyword string) ([]models.Product, error) {
	ctx := context.Background()
	keyword = strings.TrimSpace(keyword)
	baseQuery := gorm.G[models.Product](s.DB)

	if keyword != "" {
		like := "%" + strings.ToLower(keyword) + "%"
		return baseQuery.Where("LOWER(name) LIKE ? OR LOWER(description) LIKE ?", like, like).Find(ctx)
	}

	return baseQuery.Find(ctx)
}
