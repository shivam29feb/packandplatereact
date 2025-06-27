# Pack and Plate Subscription Management Strategy

## Subscription Plans

### Plan Tiers
1. **Common (Free Tier)**
   - Limited features
   - Up to 10 customers
   - Basic reporting

2. **Rare (₹99/month)**
   - Basic features
   - Up to 50 customers
   - Standard reporting

3. **Epic (₹199/month)**
   - Advanced features
   - Up to 200 customers
   - Detailed analytics

4. **Legendary (₹499/month)**
   - Comprehensive features
   - Unlimited customers
   - Advanced analytics

## Database Schema Updates

### 1. Subscription Plans Table
```sql
CREATE TABLE subscription_plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    billing_cycle ENUM('monthly', 'yearly') DEFAULT 'monthly',
    max_customers INT,
    features JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. User Subscriptions Table
```sql
CREATE TABLE user_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id VARCHAR(50) NOT NULL,
    status ENUM('active', 'canceled', 'paused', 'expired') NOT NULL,
    current_period_start DATETIME NOT NULL,
    current_period_end DATETIME NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    payment_method_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);
```

### 3. Invoices Table
```sql
CREATE TABLE invoices (
    id VARCHAR(50) PRIMARY KEY,
    subscription_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status ENUM('paid', 'pending', 'failed', 'refunded') NOT NULL,
    due_date DATETIME,
    paid_at DATETIME,
    invoice_pdf_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(id)
);
```

## API Endpoints

### Subscription Plans
- `GET /api/subscription/plans` - List all available plans
- `GET /api/subscription/plans/:id` - Get plan details
- `POST /api/admin/subscription/plans` - Create new plan (admin)
- `PUT /api/admin/subscription/plans/:id` - Update plan (admin)
- `DELETE /api/admin/subscription/plans/:id` - Deactivate plan (admin)

### User Subscriptions
- `GET /api/subscriptions` - Get current user's subscription
- `POST /api/subscriptions` - Create new subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Cancel subscription
- `GET /api/subscriptions/invoices` - Get subscription invoices

## Admin Interface Components

### 1. Subscription Plans Management
- List of all plans with details
- Create/Edit plan form
- Plan status toggle
- Plan comparison view

### 2. Subscriber Management
- List of all subscribers
- Filter by plan/status
- Subscription details modal
- Manual subscription actions

### 3. Billing & Invoices
- Revenue dashboard
- Invoice list with filters
- Export functionality
- Payment failure management

### 4. Analytics
- MRR/ARR metrics
- Churn rate
- Plan popularity
- Revenue trends

## Implementation Phases

### Phase 1: Core Subscription
- Database schema implementation
- Basic subscription flow
- Admin plan management
- User subscription management

### Phase 2: Billing & Invoicing
- Payment gateway integration
- Invoice generation
- Receipt emails
- Payment failure handling

### Phase 3: Advanced Features
- Usage tracking
- Dunning management
- Pause/resume subscriptions
- Coupons & discounts

## Security Considerations
- PCI compliance for payment processing
- Rate limiting on subscription endpoints
- Audit logging for all subscription changes
- Role-based access control

## Monitoring & Alerts
- Failed payment notifications
- Subscription expiration alerts
- Revenue threshold alerts
- System health monitoring
