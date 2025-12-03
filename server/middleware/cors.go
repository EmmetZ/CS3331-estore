package middleware

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// CORSMiddleware handles Cross-Origin Resource Sharing
func CORSMiddleware() gin.HandlerFunc {
	// Configure CORS with specific settings
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{
		"http://localhost:5173", // Vite development server
	}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With", "X-HTTP-Method-Override"}
	config.ExposeHeaders = []string{"Content-Length", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", "X-Response-Time"}
	config.AllowCredentials = true
	config.MaxAge = 86400 // 24 hours in seconds

	return cors.New(config)
}
