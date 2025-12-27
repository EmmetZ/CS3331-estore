# 用例分析

项目分为客户端和服务端两部分。

## 参与者

- 访客 / 未登录用户
- 已登录用户
- 管理员
- 系统（后端服务、Tauri 客户端）

## 主要用例

1. 浏览商品列表
   - 主参与者：访客/已登录用户
   - 前置条件：无
   - 主流程：访问主页 → 搜索/查看商品列表

2. 查看商品详情
   - 主参与者：访客/已登录用户
   - 前置条件：存在有效商品 ID
   - 主流程：点击商品 → 打开详情页 → 请求商品详情

3. 添加商品
   - 主参与者：已登录用户
   - 前置条件：用户已登录（有权限）
   - 主流程：点击加号 → 填表提交 → 客户端调用创建接口 → 后端持久化商品

4. 删除商品
   - 主参与者：卖家（商品所属用户）或管理员
   - 前置条件：有删除权限（是卖家或管理员）
   - 主流程：在详情页发起删除 → 客户端调用删除接口 → 后端删除记录

5. 登录 / 登出
   - 主参与者：访客（注册/登录）
   - 前置条件：无（登录），已登录（登出）
   - 主流程：填写凭证 → 调用认证接口 → 更新本地会话/Token → 获取当前用户信息

6. 注册
   - 主参与者：访客
   - 前置条件：无
   - 主流程：填写注册信息 → 调用注册接口 → 创建用户 → 自动登录

7. 查看/编辑个人资料
   - 主参与者：已登录用户
   - 前置条件：已登录并获取当前用户信息
   - 主流程：进入个人页面 → 查看信息或切换到编辑 → 提交更新 → 后端更新并返回最新用户

8. 管理员面板（用户与商品管理）
   - 主参与者：管理员
   - 前置条件：用户是管理员（user.is_admin === true）
   - 主流程：打开管理页 → 切换标签（用户/商品） → 执行管理操作（刷新、删除等）

9. 后端 API 调用 / Token 管理（系统用例）
   - 主参与者：系统（Tauri 客户端 + 服务器）
   - 前置条件：Tauri 客户端运行，token 数据文件夹已初始化
   - 主流程：客户端发起 HTTP 请求 → 处理 token 刷新/存储 → 返回 ApiResponse 给前端

## 用例图

```mermaid
graph LR
    %% 使用 graph 语法模拟用例图，兼容所有版本

    %% 定义角色 (使用方括号+Emoji模拟Actor)
    Guest["👤 访客"]
    User["👤 已登录用户"]
    Admin["👤 管理员"]
    System["💻 系统"]

    %% 定义用例 (使用圆括号模拟椭圆)
    UC_Browse("浏览商品列表")
    UC_ViewDetail("查看商品详情")
    UC_AddProduct("添加商品")
    UC_DeleteProduct("删除商品")
    UC_Register("注册")
    UC_Auth("登录 / 登出")
    UC_ViewEditProfile("查看/编辑个人资料")
    UC_AdminManageUsers("管理员：管理用户")
    UC_AdminManageProducts("管理员：管理商品")
    UC_API("后端 API / Token 管理")

    %% 访客关系
    Guest --> UC_Register

    %% 用户关系
    User --> UC_Browse
    User --> UC_ViewDetail
    User --> UC_AddProduct
    User --> UC_DeleteProduct
    User --> UC_ViewEditProfile
    User --> UC_Auth

    %% 管理员关系
    Admin --> UC_Browse
    Admin --> UC_ViewDetail
    Admin --> UC_AddProduct
    Admin --> UC_DeleteProduct
    Admin --> UC_ViewEditProfile
    Admin --> UC_AdminManageUsers
    Admin --> UC_AdminManageProducts
    Admin --> UC_Auth

    %% 系统与API依赖关系 (使用虚线 -.->)
    System -.->|supports| UC_API
    UC_Auth -.->|uses| UC_API
    UC_Register -.->|uses| UC_API
    UC_Browse -.->|uses| UC_API
    UC_ViewDetail -.->|uses| UC_API
    UC_AddProduct -.->|uses| UC_API
    UC_DeleteProduct -.->|uses| UC_API
    UC_ViewEditProfile -.->|uses| UC_API
    UC_AdminManageUsers -.->|uses| UC_API
    UC_AdminManageProducts -.->|uses| UC_API
```

## 顺序图

### 登录 / 登出

```mermaid
sequenceDiagram
    participant U as 用户
    participant FE as 前端/Tauri
    participant API as 后端API
    participant DB as 数据库

    U->>FE: 提交用户名/密码
    FE->>API: POST /api/login
    API->>DB: 校验用户、密码哈希
    DB-->>API: 认证结果
    API-->>FE: 返回 Token
    FE-->>U: 持久化 Token

    FE->>API: POST /api/user/me
    API->>DB: 查询用户信息
    DB-->>API: 用户记录
    API-->>FE: 返回 User
    FE-->>U: 进入应用

    U->>FE: 点击登出
    FE->>API: POST /api/logout
    FE-->>U: 清理本地 Token，退出
```

### 注册

```mermaid
sequenceDiagram
    participant U as 用户
    participant FE as 前端/Tauri
    participant API as 后端API
    participant DB as 数据库

    U->>FE: 提交用户名/邮箱/密码
    FE->>API: POST /register
    API->>DB: 写入用户 + 哈希密码
    DB-->>API: 写入成功
    API-->>FE: 返回登录成功信息
    FE-->>U: 注册成功
```

### 管理员查看

```mermaid
sequenceDiagram
    participant A as 管理员
    participant FE as 前端/Tauri
    participant API as 后端API
    participant DB as 数据库

    A->>FE: 打开管理-用户页
    FE->>API: GET /api/admin/users
    API->>DB: 查询全部用户
    DB-->>API: 用户列表
    API-->>FE: 返回用户列表
    FE-->>A: 展示用户表格

    A->>FE: 打开管理-商品页/商品详情
    FE->>API: GET /api/products
    API->>DB: 查询商品列表
    DB-->>API: 商品列表
    API-->>FE: 返回商品列表
    FE-->>A: 展示列表
```

### 删除商品

> 管理员与商品所有者共用同一商品接口（/api/product/:id），后端会在控制器内放行管理员。

```mermaid
sequenceDiagram
    participant A as 用户/管理员
    participant FE as 前端/Tauri
    participant API as 后端API
    participant DB as 数据库

    A->>FE: 打开管理-商品页/商品详情
    FE->>API: GET /api/products
    API->>DB: 查询商品列表
    DB-->>API: 商品列表
    API-->>FE: 返回商品列表
    FE-->>A: 展示列表

    A->>FE: 点击删除商品{id}
    FE->>API: DELETE /api/product/{id}
    API->>DB: 删除商品记录
    DB-->>API: 删除结果
    API-->>FE: 返回删除成功
    FE-->>A: 列表刷新/提示成功
```

### 浏览/查看商品详情

```mermaid
sequenceDiagram
    participant U as 用户
    participant FE as 前端/Tauri
    participant API as 后端API
    participant DB as 数据库

    U->>FE: 打开首页/搜索
    FE->>API: GET /products?keyword=...
    API->>DB: 查询商品列表
    DB-->>API: 列表结果
    API-->>FE: 返回商品列表
    FE-->>U: 展示列表

    U->>FE: 点击某商品
    FE->>API: GET /product/{id}
    API->>DB: 查询商品 + 卖家信息
    DB-->>API: 商品与卖家
    API-->>FE: 返回详情
    FE-->>U: 展示详情
```

### 添加商品（已登录用户）

```mermaid
sequenceDiagram
    participant U as 已登录用户
    participant FE as 前端/Tauri
    participant API as 后端API
    participant DB as 数据库

    U->>FE: 打开添加商品表单
    FE-->>U: 预填/校验表单
    U->>FE: 提交名称/描述/价格
    FE->>API: POST /product
    API->>DB: 插入商品，关联 UserID
    DB-->>API: 新商品记录
    API-->>FE: 返回创建后的商品
    FE-->>U: 列表刷新/跳转详情
```

## 类图

<!-- TODO -->

```mermaid
classDiagram
    %% Backend Models
    class User {
        -uint ID
        -string Username
        -string Email
        -string Phone
        -string Address
        -bool IsAdmin
        +Product[] Products
    }

    class UserAuth {
        -uint ID
        -string Password
    }

    class Product {
        -uint ID
        -string Name
        -string Description
        -int Price
        -time CreatedAt
        -uint UserID
        +User User
    }

    %% Backend DTOs
    class RegisterRequest {
        -string Username
        -string Email
        -string Password
    }

    class UpdateUserRequest {
        -string Username
        -string Email
        -string Phone
        -string Address
    }

    class UpdatePasswordRequest {
        -string OldPassword
        -string NewPassword
    }

    class UserDTO {
        -uint ID
        -string Username
        -string Email
        -string Phone
        -string Address
        -bool IsAdmin
    }

    class CreateProductRequest {
        -string Name
        -string Description
        -int Price
    }

    class UpdateProductRequest {
        -string Name
        -string Description
        -int Price
    }

    class ProductResponse {
        -uint ID
        -string Name
        -string Description
        -int Price
        -Seller Seller
    }

    class Seller {
        -uint ID
        -string Username
        -string Email
        -string Phone
        -string Address
    }

    %% Service Interfaces and Implementations
    class ProductService {
        <<interface>>
        +CreateProduct(userID uint, name, description string, price int)*
        +GetProduct(productID uint)*
        +UpdateProduct(productID uint, name, description string, price int)*
        +DeleteProduct(productID uint)*
        +SearchProducts(keyword string)*
    }

    class ProductServiceImpl {
        -DB* DB
        +CreateProduct(userID uint, name, description string, price int) Product
        +GetProduct(productID uint) Product
        +UpdateProduct(productID uint, name, description string, price int) Product
        +DeleteProduct(productID uint) error
        +SearchProducts(keyword string) Product[]
    }

    class UserService {
        <<interface>>
        +GetUser(userID uint)*
        +GetAllUsers()*
        +UpdateUser(userID uint, username, email, phone, address string)*
        +UpdateUserPassword(userID uint, oldPassword, newPassword string)*
        +DeleteUser(userID uint)*
    }

    class UserServiceImpl {
        -DB* DB
        +GetUser(userID uint) User
        +GetAllUsers() User[]
        +UpdateUser(userID uint, username, email, phone, address string) User
        +UpdateUserPassword(userID uint, oldPassword, newPassword string) error
        +DeleteUser(userID uint) error
    }

    class AuthService {
        <<interface>>
        +LoginAuthenticator(c gin.Context)*
        +RegisterUser(username, email, password string)*
    }

    class AuthServiceImpl {
        -DB* DB
        -UserService UserService
        +LoginAuthenticator(c gin.Context) any
        +RegisterUser(username, email, password string) error
    }

    %% Frontend Types
    class ApiResponse {
        <<interface>>
        -int code
        -string message
        -bool success
        -T data
    }

    class FrontendUser {
        -int id
        -string username
        -string email
        -string phone
        -string address
        -bool is_admin
    }

    class FrontendProduct {
        -int id
        -string name
        -string description
        -int price
        -Seller? seller
    }

    class LoginPayload {
        -string username
        -string password
    }

    class RegisterPayload {
        -string username
        -string email
        -string password
    }

    class ProductFormData {
        -string name
        -string description
        -int price
    }

    %% Relationships
    User "1" -- "1" UserAuth : has
    User "1" -- "*" Product : creates
    Product "*" -- "1" User : belongsTo

    ProductServiceImpl --|> ProductService : implements
    UserServiceImpl --|> UserService : implements
    AuthServiceImpl --|> AuthService : implements

    UserDTO --|> User : mapsFrom
    ProductResponse --|> Product : mapsFrom
    Seller --|> User : extractedFrom

    RegisterRequest --|> User : convertsTo
    UpdateUserRequest --|> User : updates
    CreateProductRequest --|> Product : convertsTo
    UpdateProductRequest --|> Product : updates

    AuthServiceImpl --> UserService : uses
    ProductServiceImpl --> Product : persists
    UserServiceImpl --> User : persists

    ApiResponse --> FrontendUser : contains
    ApiResponse --> FrontendProduct : contains
    FrontendProduct "1" -- "1" Seller : hasA

    LoginPayload --> AuthService : usedBy
    ProductFormData --> CreateProductRequest : convertsTo
```
