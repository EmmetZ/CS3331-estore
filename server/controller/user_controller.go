package controller

import (
	"errors"
	"net/http"

	"estore-server/dto"
	"estore-server/service"
	"estore-server/service/impl"
	"estore-server/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserController struct {
	UserService service.UserService
	AuthService service.AuthService
}

func NewUserController(db *gorm.DB) *UserController {
	return &UserController{
		UserService: impl.NewUserServiceImpl(db),
	}
}

func (uc *UserController) Register(c *gin.Context) {
	var req dto.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse(http.StatusBadRequest, "Invalid request"))
		return
	}

	// For registration, we'll only allow regular users (not admins)
	err := uc.AuthService.RegisterUser(req.Username, req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse(http.StatusInternalServerError, err.Error()))
		return
	}

	c.JSON(http.StatusCreated, dto.NewSuccessResponse(http.StatusCreated, nil, "User registered successfully"))
}

func (uc *UserController) GetMe(c *gin.Context) {
	currentUser, err := utils.GetUserFromCtx(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, dto.NewErrorResponse(http.StatusUnauthorized, "Unauthorized"))
		return
	}

	user, err := uc.UserService.GetUser(currentUser.ID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse(http.StatusInternalServerError, err.Error()))
		return
	}

	userDto := dto.NewUserDTO(user)

	c.JSON(http.StatusOK, dto.NewSuccessResponse(http.StatusOK, userDto, "User retrieved successfully"))
}

func (uc *UserController) GetUser(c *gin.Context) {
	idParam := c.Param("id")
	userID, err := utils.ParseUintParam(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse(http.StatusBadRequest, "Invalid user ID"))
		return
	}

	user, err := uc.UserService.GetUser(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, dto.NewErrorResponse(http.StatusNotFound, "User not found"))
		} else {
			c.JSON(http.StatusInternalServerError, dto.NewErrorResponse(http.StatusInternalServerError, err.Error()))
		}
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(http.StatusOK, dto.NewUserDTO(user), "User retrieved successfully"))
}

func (uc *UserController) UpdateUser(c *gin.Context) {
	requester, err := utils.GetUserFromCtx(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, dto.NewErrorResponse(http.StatusUnauthorized, "Unauthorized"))
		return
	}

	var req dto.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse(http.StatusBadRequest, "Invalid request"))
		return
	}

	user, err := uc.UserService.UpdateUser(requester.ID, req.Username, req.Email, req.Phone, req.Address)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse(http.StatusInternalServerError, err.Error()))
		return
	}

	responseData := dto.NewUserDTO(user)

	c.JSON(http.StatusOK, dto.NewSuccessResponse(http.StatusOK, responseData, "User updated successfully"))
}

func (uc *UserController) UpdateUserPassword(c *gin.Context) {
	idParam := c.Param("id")
	targetUserID, err := utils.ParseUintParam(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse(http.StatusBadRequest, "Invalid user ID"))
		return
	}

	// Check if requesting user is an admin
	requester, err := utils.GetUserFromCtx(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, dto.NewErrorResponse(http.StatusUnauthorized, "Unauthorized"))
		return
	}
	requestingUserID := requester.ID
	isAdmin := requester.IsAdmin

	// Only allow admin or the user themselves to update the password
	if !isAdmin && requestingUserID != targetUserID {
		c.JSON(http.StatusForbidden, dto.NewErrorResponse(http.StatusForbidden, "Cannot update another user's password"))
		return
	}

	var req dto.UpdatePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse(http.StatusBadRequest, "Invalid request"))
		return
	}

	if err := uc.UserService.UpdateUserPassword(targetUserID, req.OldPassword, req.NewPassword); err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse(http.StatusInternalServerError, err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(http.StatusOK, nil, "Password updated successfully"))
}

func (uc *UserController) GetAllUsers(c *gin.Context) {
	users, err := uc.UserService.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse(http.StatusInternalServerError, err.Error()))
		return
	}

	var userResponses []dto.PartialUserDTO
	for _, u := range users {
		userResponses = append(userResponses, *dto.NewParitialUserDTO(&u))
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(http.StatusOK, userResponses, "Users retrieved successfully"))
}

func (uc *UserController) DeleteUser(c *gin.Context) {
	idParam := c.Param("id")
	userID, err := utils.ParseUintParam(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse(http.StatusBadRequest, "Invalid user ID"))
		return
	}

	err = uc.UserService.DeleteUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse(http.StatusInternalServerError, err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(http.StatusOK, nil, "User deleted successfully"))
}
