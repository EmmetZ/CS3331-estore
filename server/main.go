package main

import (
	"log"
	"os"

	"estore-server/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/gorm"

	"estore-server/config"
	"estore-server/route"
)

var (
	db *gorm.DB
)

func main() {
	err := godotenv.Load(".env.local")
	if err != nil {
		log.Fatal("No .env file found, relying on environment variables")
	}

	// Initialize database
	db = config.ConnectDatabase()

	// Migrate the schema
	config.MigrateDatabase(db)

	// Set up Gin
	r := gin.Default()

	// Add CORS middleware
	r.Use(middleware.CORSMiddleware())

	// Add error handling middleware globally
	r.Use(middleware.ErrorHandlerMiddleware())

	authMiddleware := middleware.AuthMiddleware(db)

	routes := []route.RouteModule{
		route.NewUserRoutesModule(db),
		route.NewAuthRoutesModule(authMiddleware),
		route.NewProductRoutesModule(db),
	}

	// Register routes
	route.RegisterRoutes(r, routes, authMiddleware)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	r.Run(":" + port)
}
