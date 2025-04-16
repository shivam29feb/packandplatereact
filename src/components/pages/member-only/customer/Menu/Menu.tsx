import React, { useState } from 'react';
import styles from './Menu.module.css';
import DashboardLayout from '../../../../templates/DashboardLayout/DashboardLayout';
import DashboardSidebar from '../../../../organisms/DashboardSidebar/DashboardSidebar';
import Card, { CardHeader, CardContent } from '../../../../molecules/Card/Card';
import Button from '../../../../atoms/Button/Button';
import Typography from '../../../../atoms/Typography/Typography';
import Badge from '../../../../atoms/Badge/Badge';
import Input from '../../../../atoms/Input/Input';
import Select from '../../../../atoms/Select/Select';
import Modal, { ModalHeader, ModalContent, ModalFooter } from '../../../../molecules/Modal/Modal';
import Tabs, { Tab, TabPanel } from '../../../../molecules/Tabs/Tabs';

// Sample menu data
const sampleMenuItems = [
  { 
    id: 1, 
    name: 'Pasta Carbonara', 
    category: 'Italian', 
    price: 12.99, 
    description: 'Creamy pasta with bacon, eggs, and parmesan cheese.',
    image: 'https://via.placeholder.com/300x200?text=Pasta+Carbonara',
    rating: 4.5,
    isFavorite: true
  },
  { 
    id: 2, 
    name: 'Chicken Tikka Masala', 
    category: 'Indian', 
    price: 14.99, 
    description: 'Grilled chicken in a creamy tomato sauce with Indian spices.',
    image: 'https://via.placeholder.com/300x200?text=Chicken+Tikka+Masala',
    rating: 4.7,
    isFavorite: false
  },
  { 
    id: 3, 
    name: 'Caesar Salad', 
    category: 'American', 
    price: 9.99, 
    description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan.',
    image: 'https://via.placeholder.com/300x200?text=Caesar+Salad',
    rating: 4.2,
    isFavorite: true
  },
  { 
    id: 4, 
    name: 'Margherita Pizza', 
    category: 'Italian', 
    price: 11.99, 
    description: 'Classic pizza with tomato sauce, mozzarella, and basil.',
    image: 'https://via.placeholder.com/300x200?text=Margherita+Pizza',
    rating: 4.6,
    isFavorite: false
  },
  { 
    id: 5, 
    name: 'Beef Burger', 
    category: 'American', 
    price: 10.99, 
    description: 'Juicy beef patty with lettuce, tomato, and cheese in a brioche bun.',
    image: 'https://via.placeholder.com/300x200?text=Beef+Burger',
    rating: 4.4,
    isFavorite: false
  },
  { 
    id: 6, 
    name: 'Pad Thai', 
    category: 'Thai', 
    price: 13.99, 
    description: 'Stir-fried rice noodles with eggs, tofu, bean sprouts, and peanuts.',
    image: 'https://via.placeholder.com/300x200?text=Pad+Thai',
    rating: 4.3,
    isFavorite: false
  },
  { 
    id: 7, 
    name: 'Sushi Platter', 
    category: 'Japanese', 
    price: 18.99, 
    description: 'Assorted sushi rolls with wasabi, ginger, and soy sauce.',
    image: 'https://via.placeholder.com/300x200?text=Sushi+Platter',
    rating: 4.8,
    isFavorite: true
  },
  { 
    id: 8, 
    name: 'Greek Salad', 
    category: 'Mediterranean', 
    price: 8.99, 
    description: 'Fresh salad with cucumber, tomato, olives, and feta cheese.',
    image: 'https://via.placeholder.com/300x200?text=Greek+Salad',
    rating: 4.1,
    isFavorite: false
  },
];

// Sample categories
const categories = [
  'All',
  'Italian',
  'Indian',
  'American',
  'Thai',
  'Japanese',
  'Mediterranean'
];

const Menu: React.FC = () => {
  // State for menu data
  const [menuItems, setMenuItems] = useState(sampleMenuItems);
  const [filteredItems, setFilteredItems] = useState(sampleMenuItems);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  
  // State for modals
  const [isItemDetailsModalOpen, setIsItemDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // State for cart
  const [cart, setCart] = useState<any[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  
  // Navigation items for the sidebar
  const navItems = [
    { label: 'Dashboard', path: '/customer/dashboard' },
    { label: 'Browse Menu', path: '/customer/menu' },
    { label: 'My Orders', path: '/customer/orders' },
    { label: 'Favorites', path: '/customer/favorites' },
    { label: 'Profile', path: '/customer/profile' },
  ];
  
  // Handle search and filter changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, categoryFilter, sortBy);
  };
  
  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category);
    applyFilters(searchTerm, category, sortBy);
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    applyFilters(searchTerm, categoryFilter, value);
  };
  
  const applyFilters = (search: string, category: string, sort: string) => {
    let filtered = [...menuItems];
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) || 
        item.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply category filter
    if (category !== 'All') {
      filtered = filtered.filter(item => item.category === category);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    
    setFilteredItems(filtered);
  };
  
  // Handle modal actions
  const openItemDetailsModal = (item: any) => {
    setSelectedItem(item);
    setIsItemDetailsModalOpen(true);
  };
  
  const closeItemDetailsModal = () => {
    setIsItemDetailsModalOpen(false);
    setSelectedItem(null);
  };
  
  const openCartModal = () => {
    setIsCartModalOpen(true);
  };
  
  const closeCartModal = () => {
    setIsCartModalOpen(false);
  };
  
  // Handle cart actions
  const addToCart = (item: any, quantity: number = 1) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // Update quantity if item already in cart
      const updatedCart = cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + quantity } 
          : cartItem
      );
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, { ...item, quantity }]);
    }
    
    // Close modal if open
    if (isItemDetailsModalOpen) {
      closeItemDetailsModal();
    }
  };
  
  const removeFromCart = (itemId: number) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
  };
  
  const updateCartItemQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    const updatedCart = cart.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
  };
  
  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Toggle favorite status
  const toggleFavorite = (itemId: number) => {
    const updatedItems = menuItems.map(item => 
      item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
    );
    setMenuItems(updatedItems);
    setFilteredItems(updatedItems);
  };
  
  return (
    <DashboardLayout
      title="Browse Menu"
      sidebarContent={<DashboardSidebar navItems={navItems} />}
      actions={
        <Button 
          variant="primary" 
          size="small"
          onClick={openCartModal}
        >
          Cart ({cart.length})
        </Button>
      }
    >
      <div className={styles.menuContent}>
        <Card variant="elevated" className={styles.filtersCard}>
          <CardContent>
            <div className={styles.filtersContainer}>
              <div className={styles.searchContainer}>
                <Input
                  type="text"
                  placeholder="Search menu..."
                  value={searchTerm}
                  onChange={handleSearch}
                  fullWidth
                />
              </div>
              
              <div className={styles.sortContainer}>
                <Select
                  name="sortBy"
                  value={sortBy}
                  onChange={handleSortChange}
                  options={[
                    { value: 'name', label: 'Name (A-Z)' },
                    { value: 'price-low', label: 'Price (Low to High)' },
                    { value: 'price-high', label: 'Price (High to Low)' },
                    { value: 'rating', label: 'Rating' },
                  ]}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className={styles.categoriesContainer}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${categoryFilter === category ? styles.active : ''}`}
              onClick={() => handleCategoryFilterChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className={styles.menuItemsGrid}>
          {filteredItems.map((item) => (
            <Card key={item.id} variant="elevated" className={styles.menuItemCard}>
              <div className={styles.menuItemImageContainer}>
                <img src={item.image} alt={item.name} className={styles.menuItemImage} />
                <button 
                  className={`${styles.favoriteButton} ${item.isFavorite ? styles.active : ''}`}
                  onClick={() => toggleFavorite(item.id)}
                  aria-label={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  ♥
                </button>
              </div>
              <CardContent>
                <div className={styles.menuItemHeader}>
                  <Typography variant="h6" className={styles.menuItemName}>{item.name}</Typography>
                  <Badge variant="filled" color="secondary">{item.category}</Badge>
                </div>
                <div className={styles.menuItemRating}>
                  {'★'.repeat(Math.floor(item.rating))}
                  {item.rating % 1 >= 0.5 ? '½' : ''}
                  {'☆'.repeat(5 - Math.ceil(item.rating))}
                  <span className={styles.ratingValue}>{item.rating}</span>
                </div>
                <Typography variant="body2" className={styles.menuItemDescription}>
                  {item.description.length > 100 
                    ? `${item.description.substring(0, 100)}...` 
                    : item.description}
                </Typography>
                <div className={styles.menuItemFooter}>
                  <Typography variant="body1" className={styles.menuItemPrice}>
                    ${item.price.toFixed(2)}
                  </Typography>
                  <div className={styles.menuItemActions}>
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => openItemDetailsModal(item)}
                    >
                      Details
                    </Button>
                    <Button 
                      variant="primary" 
                      size="small"
                      onClick={() => addToCart(item)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Item Details Modal */}
      <Modal
        open={isItemDetailsModalOpen}
        onClose={closeItemDetailsModal}
        size="medium"
      >
        {selectedItem && (
          <>
            <ModalHeader 
              title={selectedItem.name} 
              onClose={closeItemDetailsModal} 
            />
            <ModalContent>
              <div className={styles.itemDetailsContainer}>
                <div className={styles.itemDetailsImageContainer}>
                  <img src={selectedItem.image} alt={selectedItem.name} className={styles.itemDetailsImage} />
                </div>
                <div className={styles.itemDetailsInfo}>
                  <div className={styles.itemDetailsHeader}>
                    <Badge variant="filled" color="secondary">{selectedItem.category}</Badge>
                    <div className={styles.itemDetailsRating}>
                      {'★'.repeat(Math.floor(selectedItem.rating))}
                      {selectedItem.rating % 1 >= 0.5 ? '½' : ''}
                      {'☆'.repeat(5 - Math.ceil(selectedItem.rating))}
                      <span className={styles.ratingValue}>{selectedItem.rating}</span>
                    </div>
                  </div>
                  <Typography variant="body1" className={styles.itemDetailsDescription}>
                    {selectedItem.description}
                  </Typography>
                  <Typography variant="h6" className={styles.itemDetailsPrice}>
                    ${selectedItem.price.toFixed(2)}
                  </Typography>
                </div>
              </div>
            </ModalContent>
            <ModalFooter>
              <Button 
                variant="primary" 
                onClick={() => addToCart(selectedItem)}
              >
                Add to Cart
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
      
      {/* Cart Modal */}
      <Modal
        open={isCartModalOpen}
        onClose={closeCartModal}
        size="medium"
      >
        <ModalHeader 
          title="Your Cart" 
          onClose={closeCartModal} 
        />
        <ModalContent>
          {cart.length === 0 ? (
            <Typography variant="body1" className={styles.emptyCartMessage}>
              Your cart is empty. Add some items to proceed.
            </Typography>
          ) : (
            <div className={styles.cartItemsContainer}>
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.cartItemImageContainer}>
                    <img src={item.image} alt={item.name} className={styles.cartItemImage} />
                  </div>
                  <div className={styles.cartItemInfo}>
                    <Typography variant="body1" className={styles.cartItemName}>{item.name}</Typography>
                    <Typography variant="body2" className={styles.cartItemPrice}>
                      ${item.price.toFixed(2)} each
                    </Typography>
                  </div>
                  <div className={styles.cartItemQuantity}>
                    <button 
                      className={styles.quantityButton}
                      onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button 
                      className={styles.quantityButton}
                      onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className={styles.cartItemTotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button 
                    className={styles.removeButton}
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              <div className={styles.cartTotal}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">${cartTotal.toFixed(2)}</Typography>
              </div>
            </div>
          )}
        </ModalContent>
        <ModalFooter>
          <Button 
            variant="secondary" 
            onClick={closeCartModal}
          >
            Continue Shopping
          </Button>
          <Button 
            variant="primary" 
            disabled={cart.length === 0}
            onClick={() => {
              // Handle checkout
              alert('Checkout functionality would go here');
              closeCartModal();
            }}
          >
            Checkout
          </Button>
        </ModalFooter>
      </Modal>
    </DashboardLayout>
  );
};

export default Menu;
