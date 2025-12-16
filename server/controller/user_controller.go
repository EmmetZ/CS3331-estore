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
	user, err := uc.UserService.RegisterUser(req.Username, req.Password, false)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse(http.StatusInternalServerError, err.Error()))
		return
	}

	responseData := dto.UserDTO{
		ID:       user.ID,
		Username: user.Username,
		IsAdmin:  user.IsAdmin,
	}

	c.JSON(http.StatusCreated, dto.NewSuccessResponse(http.StatusCreated, responseData, "User registered successfully"))
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
	idParam := c.Param("id")
	targetUserID, err := utils.ParseUintParam(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse(http.StatusBadRequest, "Invalid user ID"))
		return
	}

	requester, err := utils.GetUserFromCtx(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, dto.NewErrorResponse(http.StatusUnauthorized, "Unauthorized"))
		return
	}
	requestingUserID := requester.ID
	isAdmin := requester.IsAdmin

	// Only allow admin or the user themselves to update the account
	if !isAdmin && requestingUserID != targetUserID {
		c.JSON(http.StatusForbidden, dto.NewErrorResponse(http.StatusForbidden, "Cannot update another user's information"))
		return
	}

	var req dto.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse(http.StatusBadRequest, "Invalid request"))
		return
	}

	user, err := uc.UserService.UpdateUser(targetUserID, req.Username)
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

	var userResponses []dto.UserDTO
	for _, u := range users {
		userResponses = append(userResponses, *dto.NewUserDTO(&u))
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
