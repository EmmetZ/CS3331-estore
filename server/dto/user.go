package dto

// RegisterRequest DTO for user registration
type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// UpdateUserRequest DTO for updating user information
type UpdateUserRequest struct {
	Username string `json:"username" binding:"required,min=3,max=100"`
}

// UpdatePasswordRequest DTO for updating user password
type UpdatePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

// UserResponse DTO for user information
type UserResponse struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Address  string `json:"address"`
	IsAdmin  bool   `json:"is_admin"`
}

// UsersResponse DTO for multiple users
type UsersResponse struct {
	Data []UserResponse `json:"data"`
}
