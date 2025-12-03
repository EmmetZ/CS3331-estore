package dto

// Response DTO for common response structure
type Response struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Success bool   `json:"success"`
	Data    any    `json:"data"`
}

// NewSuccessResponse creates a new success response
func NewSuccessResponse(code int, data any, msg string) Response {
	return Response{
		Code:    code,
		Success: true,
		Message: msg,
		Data:    data,
	}
}

// NewErrorResponse creates a new error response
func NewErrorResponse(code int, msg string) Response {
	return Response{
		Code:    code,
		Success: false,
		Message: msg,
		Data:    nil,
	}
}
