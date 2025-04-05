# Proposed Implementation

## Authentication Flow
```
User → Login Page → Backend Authentication → 
User Type Determined → Session with Role Created → 
Role-based Redirect → Appropriate Dashboard
```

## Protected Route System
```
Route Request → Check Authentication → 
Check User Role → Allow/Deny Access → 
Render Component or Redirect to Login
```

## Component Structure
```
App
├── Public Components
│   ├── Home
│   ├── About
│   ├── Contact
│   └── Login/Signup
├── Admin Components
│   ├── Dashboard
│   ├── User Management
│   └── Settings
├── Member Components
│   ├── Dashboard
│   ├── Dish Management
│   └── Customer Management
└── Customer Components
    ├── Dashboard
    ├── Order Management
    └── Profile
```

## Current Database Structure
```
admins
├── admin_id (PK)
├── admin_username
├── admin_email
├── admin_password_hash
└── admin_created_at

member
├── member_id (PK)
├── full_name
├── email
├── phone_number
├── address
├── business_name
├── password_hash
├── registration_date
├── status
├── verification_token
├── token_expire
└── last_login

dishes
├── dish_id (PK)
├── dish_name
├── mealTypes
├── dish_description
├── dish_price
└── dish_created_at

memberships
├── membership_id (PK)
└── membership_plan_name
```

## Proposed Database Structure
```
users
├── user_id (PK)
├── username
├── email
├── password_hash
├── user_type (admin/member/customer)
├── created_at
├── last_login
├── status
├── verification_token
└── token_expire

member_profiles
├── profile_id (PK)
├── user_id (FK to users)
├── full_name
├── phone_number
├── address
├── business_name
└── membership_id (FK to memberships)

customer_profiles
├── profile_id (PK)
├── user_id (FK to users)
├── full_name
├── phone_number
├── address
└── dietary_preferences

dishes
├── dish_id (PK)
├── member_id (FK to users)
├── dish_name
├── mealTypes
├── dish_description
├── dish_price
└── dish_created_at

memberships
├── membership_id (PK)
├── membership_plan_name
├── description
├── price
├── duration_days
└── features

orders
├── order_id (PK)
├── customer_id (FK to users)
├── member_id (FK to users)
├── order_date
├── status
├── total_amount
└── payment_status

order_items
├── item_id (PK)
├── order_id (FK to orders)
├── dish_id (FK to dishes)
├── quantity
└── price
```

## API Structure (Current)
```
/src/config
├── connection.php (Database connection)
├── admin/
│   ├── admin_login_api.php
│   └── admin_signup_api.php
├── member/
│   ├── login_api.php
│   └── signup_api.php
└── dish/
    ├── add_dish.php
    ├── get_dish_list.php
    ├── update_dish.php
    └── delete_dish.php
```

## API Structure (Proposed)
```
/src/config
├── connection.php (Database connection)
├── auth/
│   ├── login.php (Unified login for all user types)
│   ├── signup.php (Unified signup with role parameter)
│   ├── logout.php (Unified logout)
│   └── verify.php (Email verification)
├── admin/
│   ├── users.php (User management)
│   └── settings.php (Admin settings)
├── member/
│   ├── profile.php (Member profile management)
│   ├── dishes.php (CRUD operations for dishes)
│   └── customers.php (Member's customers)
├── customer/
│   ├── profile.php (Customer profile management)
│   ├── orders.php (Order management)
│   └── dishes.php (Browse available dishes)
└── common/
    ├── utils.php (Shared utilities)
    └── validation.php (Input validation)
```

## Implementation Steps

### 1. Database Migration
1. Create new tables according to proposed structure
2. Create migration scripts to transfer existing data
3. Update database connection and queries

### 2. Authentication System
1. Create unified authentication endpoints
2. Implement role-based access control
3. Update frontend authentication flow

### 3. Frontend Components
1. Create protected route component
2. Implement authentication context
3. Build role-specific dashboards

### 4. API Endpoints
1. Create unified authentication endpoints
2. Implement CRUD operations for all entities
3. Add validation and error handling

### 5. Testing
1. Test database migration
2. Test authentication flow
3. Test CRUD operations
4. Test role-based access control