# Component Specification

## 1. Payment Components

### 1.1 Atoms

#### CurrencyDisplay
- **Purpose**: Displays formatted currency values
- **Props**:
  - `value: number` - The amount to display
  - `currency?: string` - Currency code (default: 'INR')
  - `className?: string` - Additional CSS classes

### 1.2 Molecules

#### PaymentMethodSelector
- **Purpose**: Allows selection of payment method
- **Props**:
  - `selectedMethod: string` - Currently selected method
  - `onChange: (method: string) => void` - Change handler
  - `methods: Array<{id: string, label: string, icon: string}>` - Available methods

#### CardForm
- **Purpose**: Collects card payment details
- **Props**:
  - `onSubmit: (data: CardData) => void`
  - `onError: (errors: FieldErrors) => void`
  - `defaultValues?: Partial<CardData>`
  - `saveCardOption?: boolean`
  - `isSubmitting?: boolean`

#### UPIForm
- **Purpose**: Handles UPI payments
- **Props**:
  - `onSubmit: (upiId: string) => void`
  - `onError: (error: string) => void`
  - `isSubmitting?: boolean`

#### NetBankingForm
- **Purpose**: Handles net banking payments
- **Props**:
  - `onSubmit: (bankCode: string) => void`
  - `banks: Array<{code: string, name: string}>`
  - `isSubmitting?: boolean`

#### PaymentSummary
- **Purpose**: Displays order summary
- **Props**:
  - `subtotal: number`
  - `tax: number`
  - `discount?: number`
  - `total: number`
  - `currency?: string`

#### SavedCards
- **Purpose**: Displays saved payment methods
- **Props**:
  - `cards: Array<Card>`
  - `onSelect: (card: Card) => void`
  - `onDelete: (cardId: string) => void`
  - `selectedCardId?: string`

#### PromoCode
- **Purpose**: Handles promo code application
- **Props**:
  - `onApply: (code: string) => Promise<boolean>`
  - `onRemove: () => void`
  - `appliedCode?: string`
  - `isLoading?: boolean`

### 1.3 Organisms

#### CheckoutForm
- **Purpose**: Main checkout form
- **Props**:
  - `plan: Plan`
  - `user?: User`
  - `onSuccess: (paymentData) => void`
  - `onError: (error: Error) => void`
  - `savedCards?: Card[]`

#### PaymentProcessor
- **Purpose**: Handles payment processing
- **Props**:
  - `amount: number`
  - `currency?: string`
  - `onSuccess: (data) => void`
  - `onError: (error) => void`
  - `metadata?: object`

---

## 2. Menu Management Components

### 2.1 Molecules

#### MenuItem
- **Purpose**: Displays a single menu item
- **Props**:
  - `item: MenuItem`
  - `onEdit?: () => void`
  - `onDelete?: () => void`
  - `onToggleAvailability?: () => void`

#### MenuCategory
- **Purpose**: Groups menu items by category
- **Props**:
  - `category: string`
  - `items: MenuItem[]`
  - `onEditItem: (item: MenuItem) => void`
  - `onDeleteItem: (id: string) => void`

### 2.2 Organisms

#### MenuBuilder
- **Purpose**: Full menu management interface
- **Props**:
  - `categories: Category[]`
  - `onSave: (categories: Category[]) => Promise<void>`
  - `onPublish: () => Promise<void>`

#### DailyMenu
- **Purpose**: Displays daily menu
- **Props**:
  - `date: Date`
  - `menu: DailyMenu`
  - `onDateChange: (date: Date) => void`
  - `onUpdateMenu: (menu: DailyMenu) => Promise<void>`

---

## 3. Customer Management Components

### 3.1 Molecules

#### CustomerCard
- **Purpose**: Displays customer information
- **Props**:
  - `customer: Customer`
  - `onEdit: () => void`
  - `onDelete: () => void`
  - `onViewHistory: () => void`

#### AttendanceMarking
- **Purpose**: Marks customer attendance
- **Props**:
  - `customerId: string`
  - `date: Date`
  - `status: 'present' | 'absent' | 'pending'`
  - `onStatusChange: (status: string) => Promise<void>`

### 3.2 Organisms

#### CustomerList
- **Purpose**: Displays list of customers
- **Props**:
  - `customers: Customer[]`
  - `onSelect: (customer: Customer) => void`
  - `onAddNew: () => void`
  - `onSearch: (query: string) => void`
  - `onImport: (file: File) => Promise<void>`
  - `onExport: () => void`

#### CustomerForm
- **Purpose**: Add/edit customer details
- **Props**:
  - `customer?: Customer`
  - `onSubmit: (data: CustomerFormData) => Promise<void>`
  - `onCancel: () => void`
  - `isSubmitting?: boolean`

---

## 4. Reporting Components

### 4.1 Molecules

#### ReportFilter
- **Purpose**: Filter options for reports
- **Props**:
  - `dateRange: {start: Date, end: Date}`
  - `onDateChange: (range: {start: Date, end: Date}) => void`
  - `filters: Record<string, any>`
  - `onFilterChange: (filters: Record<string, any>) => void`

### 4.2 Organisms

#### SalesReport
- **Purpose**: Displays sales analytics
- **Props**:
  - `data: SalesData[]`
  - `dateRange: {start: Date, end: Date}`
  - `onDateChange: (range: {start: Date, end: Date}) => void`
  - `onExport: (format: 'csv' | 'pdf') => void`

## Component Dependencies

### Payment Flow
```
CheckoutForm
├── PaymentMethodSelector
│   ├── FontAwesome Icons
│   └── SavedCards
├── CardForm/UPIForm/NetBankingForm
├── PaymentSummary
└── PromoCode
```

### Menu Management
```
MenuBuilder
├── MenuCategory
│   └── MenuItem
└── MenuFilter
```

### Customer Management
```
CustomerList
├── CustomerCard
├── CustomerSearch
└── AttendanceCalendar
```

## Implementation Priorities

### Phase 1: Core Payment Flow (Sprint 1)
1. `CurrencyDisplay`
2. `PaymentMethodSelector`
3. `CardForm`
4. `PaymentSummary`
5. `CheckoutForm`
6. `PaymentProcessor`

### Phase 2: Menu Management (Sprint 2)
1. `MenuItem`
2. `MenuCategory`
3. `MenuBuilder`
4. `DailyMenu`

### Phase 3: Customer Management (Sprint 3)
1. `CustomerCard`
2. `CustomerList`
3. `CustomerForm`
4. `AttendanceMarking`

### Phase 4: Reporting (Sprint 4)
1. `ReportFilter`
2. `SalesReport`
3. `AttendanceReport`
4. `CustomerReport`

## Type Definitions

```typescript
interface CardData {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
  saveCard?: boolean;
}

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  joinDate: Date;
  lastVisit?: Date;
  status: 'active' | 'inactive' | 'suspended';
  mealPlan?: {
    type: string;
    startDate: Date;
    endDate?: Date;
  };
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  isAvailable: boolean;
  isSpecial?: boolean;
  imageUrl?: string;
  dietaryInfo?: {
    isVegetarian: boolean;
    isVegan?: boolean;
    allergens?: string[];
  };
}
```

## Styling Guidelines

### CSS Modules
- Use BEM naming convention
- One CSS module per component
- Mobile-first approach
- Use CSS variables for theming

### Responsive Breakpoints
```css
/* Mobile (default) */
.component {}

/* Tablet */
@media (min-width: 768px) {}

/* Desktop */
@media (min-width: 1024px) {}
```

## Testing Strategy

### Unit Tests
- Test props and callbacks
- Test edge cases
- Test error states

### Integration Tests
- Test component interactions
- Test form submissions
- Test API integrations

---
*Last Updated: 2025-06-23*
