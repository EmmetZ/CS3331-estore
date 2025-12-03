package middleware

import (
	"net/http"
	"strings"

	"estore-server/dto"

	"github.com/gin-gonic/gin"
)

// ErrorHandlerMiddleware catches exceptions and returns standardized error responses
func ErrorHandlerMiddleware() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		c.Next()

		// Check if there are any errors in the context
		if len(c.Errors) > 0 {
			// Get the last error
			err := c.Errors.Last().Err
			errMsg := err.Error()

			// Determine the appropriate HTTP status code
			var statusCode int

			// Check for specific error patterns to determine status code
			switch {
			case strings.Contains(errMsg, "400") || strings.Contains(errMsg, "invalid") || strings.Contains(errMsg, "Invalid"):
				statusCode = http.StatusBadRequest
			case strings.Contains(errMsg, "401") || strings.Contains(errMsg, "Unauthorized") || strings.Contains(errMsg, "unauthorized"):
				statusCode = http.StatusUnauthorized
			case strings.Contains(errMsg, "403") || strings.Contains(errMsg, "Forbidden") || strings.Contains(errMsg, "forbidden"):
				statusCode = http.StatusForbidden
			case strings.Contains(errMsg, "404") || strings.Contains(errMsg, "not found") || strings.Contains(errMsg, "Not found"):
				statusCode = http.StatusNotFound
			case strings.Contains(errMsg, "409") || strings.Contains(errMsg, "conflict") || strings.Contains(errMsg, "Conflict"):
				statusCode = http.StatusConflict
			default:
				statusCode = http.StatusInternalServerError
			}

			// Create standardized error response using DTO
			c.JSON(statusCode, dto.NewErrorResponse(statusCode, errMsg))
		}
	})
}
