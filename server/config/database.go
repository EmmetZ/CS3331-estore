package config

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"estore-server/models"
)

// DatabaseConfig holds database configuration parameters
type DatabaseConfig struct {
	Host     string
	Port     string
	Username string
	Password string
	Database string
}

// getDatabaseConfig returns database configuration from environment variables or defaults
func getDatabaseConfig() DatabaseConfig {
	return DatabaseConfig{
		Host:     getEnvOrDefault("DB_HOST", "localhost"),
		Port:     getEnvOrDefault("DB_PORT", "3306"),
		Username: getEnvOrDefault("DB_USER", "root"),
		Password: os.Getenv("DB_PASSWORD"),
		Database: os.Getenv("DB_NAME"),
	}
}

// getEnvOrDefault returns environment variable value or default if not set
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func ConnectDatabase() *gorm.DB {
	config := getDatabaseConfig()

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.Username,
		config.Password,
		config.Host,
		config.Port,
		config.Database,
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	return db
}

func MigrateDatabase(db *gorm.DB) {
	err := db.AutoMigrate(
		&models.User{},
		&models.UserAuth{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}
}
