# API Migration Plan

## Current API Structure
The current API is organized in a role-based folder structure with separate authentication endpoints for different user types:

- `/src/config/admin/admin_login_api.php`
- `/src/config/admin/admin_signup_api.php`
- `/src/config/member/login_api.php`
- `/src/config/member/signup_api.php`

## Phase 1: Create Unified Authentication Endpoints

### 1. Create Unified Login Endpoint
Create a new file `/src/config/auth/login.php` that:
- Accepts user credentials and user type
- Validates credentials based on user type
- Returns user data with role information
- Sets appropriate session variables

### 2. Create Unified Signup Endpoint
Create a new file `/src/config/auth/signup.php` that:
- Accepts user data including user type
- Validates input data
- Creates user in appropriate table
- Returns success/failure with user data

### 3. Create Unified Logout Endpoint
Create a new file `/src/config/auth/logout.php` that:
- Destroys session
- Clears cookies
- Returns success message

## Phase 2: Update Frontend Services

### 1. Service Organization Strategy
We will organize services by functionality rather than user type:
- `loginService.ts` - Handles login functionality for all user types
- `logoutService.ts` - Handles logout functionality for all user types
- `userService.ts` - Handles user registration and profile management
- `dishService.ts` - Handles dish-related operations
- etc.

This approach provides better separation of concerns and makes the codebase more maintainable.

### 2. Update Existing Services
Modify existing services to use the new authentication service.

## Phase 3: Implement Role-Based Authorization

### 1. Create Authorization Middleware
Create a new file `/src/config/auth/authorize.php` that:
- Validates session
- Checks user role against required roles
- Returns appropriate response

### 2. Update API Endpoints
Modify existing endpoints to use the authorization middleware.

## Phase 4: Testing and Deployment

### 1. Test Authentication Flow
- Test login with different user types
- Test signup with different user types
- Test logout
- Test protected routes

### 2. Deploy Changes
- Deploy new API endpoints
- Deploy updated frontend services
- Monitor for issues
