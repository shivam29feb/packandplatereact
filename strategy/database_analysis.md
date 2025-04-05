# Database Analysis and Strategy

## Current Database Structure

### Tables Overview
1. `admins` - System administrators
2. `dishes` - Food items offered by members
3. `member` - Business owners/subscribers
4. `memberships` - Subscription plans

### Table Details

#### admins
- `admin_id` (int, PK, auto_increment)
- `admin_username` (varchar(50), required)
- `admin_email` (varchar(100), required, unique)
- `admin_password_hash` (varchar(255), required)
- `admin_created_at` (timestamp, default: current_timestamp)

#### dishes
- `dish_id` (int, PK, auto_increment)
- `dish_name` (varchar(100), required)
- `mealTypes` (varchar(255), required)
- `dish_description` (text, optional)
- `dish_price` (decimal(10,2), required)
- `dish_created_at` (timestamp, default: current_timestamp)

#### member
- `member_id` (int, PK, auto_increment)
- `full_name` (varchar(255), required)
- `email` (varchar(255), required, unique)
- `phone_number` (varchar(20), required)
- `address` (text, optional)
- `business_name` (varchar(255), required)
- `password_hash` (varchar(255), required)
- `registration_date` (timestamp, default: current_timestamp)
- `status` (enum: 'active','pending','suspended', default: 'pending')
- `verification_token` (varchar(255), optional)
- `token_expire` (timestamp, optional)
- `last_login` (timestamp, optional)

#### memberships
- `membership_id` (int, PK, auto_increment)
- `membership_plan_name` (varchar(100), required)

## Database Structure Analysis

### Observations
1. **Separate Authentication Tables**: Currently using separate tables (`admins` and `member`) for different user types.
2. **Missing Customer Table**: No table for end customers who order from members.
3. **Limited Membership Information**: The `memberships` table lacks details like pricing, features, duration.
4. **No Relationships**: Missing foreign key relationships between tables (e.g., dishes to members).
5. **Inconsistent Naming**: Some tables use singular (member) while others use plural (admins, dishes).

### Proposed Database Improvements

#### 1. Unified Users Table
Create a unified `users` table with a role field to distinguish between user types:
```sql
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('admin', 'member', 'customer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    status ENUM('active', 'pending', 'suspended') DEFAULT 'pending',
    verification_token VARCHAR(255) NULL,
    token_expire TIMESTAMP NULL
);
```

#### 2. Profile Tables for User Types
Create separate profile tables for different user types:

```sql
CREATE TABLE member_profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT,
    business_name VARCHAR(255) NOT NULL,
    membership_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (membership_id) REFERENCES memberships(membership_id)
);

CREATE TABLE customer_profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    dietary_preferences TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

#### 3. Enhanced Memberships Table
```sql
ALTER TABLE memberships 
ADD COLUMN description TEXT,
ADD COLUMN price DECIMAL(10,2) NOT NULL,
ADD COLUMN duration_days INT NOT NULL,
ADD COLUMN features TEXT;
```

#### 4. Add Relationships to Dishes
```sql
ALTER TABLE dishes
ADD COLUMN member_id INT NOT NULL,
ADD FOREIGN KEY (member_id) REFERENCES users(user_id);
```

#### 5. Create Orders Table
```sql
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    member_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES users(user_id),
    FOREIGN KEY (member_id) REFERENCES users(user_id)
);

CREATE TABLE order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    dish_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (dish_id) REFERENCES dishes(dish_id)
);
```

## Migration Strategy

### Phase 1: Create New Tables
1. Create the `users` table
2. Create profile tables (`member_profiles`, `customer_profiles`)
3. Enhance the `memberships` table
4. Create `orders` and `order_items` tables

### Phase 2: Migrate Existing Data
1. Migrate admin data to the `users` table with user_type='admin'
2. Migrate member data to the `users` table with user_type='member'
3. Create corresponding entries in `member_profiles`
4. Add foreign key to `dishes` table

### Phase 3: Update Application Code
1. Update authentication logic to use the unified `users` table
2. Update member management to use both `users` and `member_profiles`
3. Update dish management to include member relationship
4. Implement order management functionality