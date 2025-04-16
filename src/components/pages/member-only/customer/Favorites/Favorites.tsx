import React, { useState } from 'react';
import styles from './Favorites.module.css';
import DashboardLayout from '../../../../templates/DashboardLayout/DashboardLayout';
import DashboardSidebar from '../../../../organisms/DashboardSidebar/DashboardSidebar';
import Card, { CardHeader, CardContent } from '../../../../molecules/Card/Card';
import Button from '../../../../atoms/Button/Button';
import Typography from '../../../../atoms/Typography/Typography';
import Badge from '../../../../atoms/Badge/Badge';
import Input from '../../../../atoms/Input/Input';
import Modal, { ModalHeader, ModalContent, ModalFooter } from '../../../../molecules/Modal/Modal';

// Sample favorite items data
const sampleFavorites = [
  { 
    id: 1, 
    name: 'Pasta Carbonara', 
    category: 'Italian', 
    price: 12.99, 
    description: 'Creamy pasta with bacon, eggs, and parmesan cheese.',
    image: 'https://via.placeholder.com/300x200?text=Pasta+Carbonara',
    rating: 4.5,
    lastOrdered: '2023-05-15'
  },
  { 
    id: 3, 
    name: 'Caesar Salad', 
    category: 'American', 
    price: 9.99, 
    description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan.',
    image: 'https://via.placeholder.com/300x200?text=Caesar+Salad',
    rating: 4.2,
    lastOrdered: '2023-05-10'
  },
  { 
    id: 7, 
    name: 'Sushi Platter', 
    category: 'Japanese', 
    price: 18.99, 
    description: 'Assorted sushi rolls with wasabi, ginger, and soy sauce.',
    image: 'https://via.placeholder.com/300x200?text=Sushi+Platter',
    rating: 4.8,
    lastOrdered: '2023-04-28'
  }
];

const Favorites: React.FC = () => {
  // State for favorites data
  const [favorites, setFavorites] = useState(sampleFavorites);
  const [filteredFavorites, setFilteredFavorites] = useState(sampleFavorites);
  
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for modals
  const [isItemDetailsModalOpen, setIsItemDetailsModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // State for cart
  const [cart, setCart] = useState<any[]>([]);
  
  // Navigation items for the sidebar
  const navItems = [
    { label: 'Dashboard', path: '/customer/dashboard' },
    { label: 'Browse Menu', path: '/customer/menu' },
    { label: 'My Orders', path: '/customer/orders' },
    { label: 'Favorites', path: '/customer/favorites' },
    { label: 'Profile', path: '/customer/profile' },
  ];
  
  // Handle search change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value) {
      const filtered = favorites.filter(item => 
        item.name.toLowerCase().includes(value.toLowerCase()) || 
        item.category.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFavorites(filtered);
    } else {
      setFilteredFavorites(favorites);
    }
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
  
  const openRemoveModal = (item: any) => {
    setSelectedItem(item);
    setIsRemoveModalOpen(true);
  };
  
  const closeRemoveModal = () => {
    setIsRemoveModalOpen(false);
    setSelectedItem(null);
  };
  
  // Handle favorite actions
  const removeFavorite = () => {
    if (!selectedItem) return;
    
    const updatedFavorites = favorites.filter(item => item.id !== selectedItem.id);
    setFavorites(updatedFavorites);
    setFilteredFavorites(updatedFavorites);
    
    closeRemoveModal();
  };
  
  // Handle cart actions
  const addToCart = (item: any) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // Update quantity if item already in cart
      const updatedCart = cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      );
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    // Show confirmation
    alert(`${item.name} added to cart!`);
  };
  
  return (
    <DashboardLayout
      title="My Favorites"
      sidebarContent={<DashboardSidebar navItems={navItems} />}
      actions={
        <Button 
          variant="primary" 
          size="small"
          onClick={() => window.location.href = '/customer/menu'}
        >
          Browse Menu
        </Button>
      }
    >
      <div className={styles.favoritesContainer}>
        <Card variant="elevated" className={styles.searchCard}>
          <CardContent>
            <Input
              type="text"
              placeholder="Search favorites..."
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
            />
          </CardContent>
        </Card>
        
        {filteredFavorites.length === 0 ? (
          <Card variant="elevated" className={styles.emptyStateCard}>
            <CardContent>
              <div className={styles.emptyState}>
                <Typography variant="h6">No Favorites Found</Typography>
                <Typography variant="body1">
                  {searchTerm 
                    ? 'No favorites match your search criteria.' 
                    : 'You haven\'t added any favorites yet.'}
                </Typography>
                {!searchTerm && (
                  <Button 
                    variant="primary"
                    onClick={() => window.location.href = '/customer/menu'}
                  >
                    Browse Menu
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={styles.favoritesGrid}>
            {filteredFavorites.map((item) => (
              <Card key={item.id} variant="elevated" className={styles.favoriteCard}>
                <div className={styles.favoriteImageContainer}>
                  <img src={item.image} alt={item.name} className={styles.favoriteImage} />
                </div>
                <CardContent>
                  <div className={styles.favoriteHeader}>
                    <Typography variant="h6" className={styles.favoriteName}>{item.name}</Typography>
                    <Badge variant="filled" color="secondary">{item.category}</Badge>
                  </div>
                  <div className={styles.favoriteRating}>
                    {'★'.repeat(Math.floor(item.rating))}
                    {item.rating % 1 >= 0.5 ? '½' : ''}
                    {'☆'.repeat(5 - Math.ceil(item.rating))}
                    <span className={styles.ratingValue}>{item.rating}</span>
                  </div>
                  <Typography variant="body2" className={styles.favoriteDescription}>
                    {item.description.length > 100 
                      ? `${item.description.substring(0, 100)}...` 
                      : item.description}
                  </Typography>
                  <div className={styles.favoriteFooter}>
                    <Typography variant="body1" className={styles.favoritePrice}>
                      ${item.price.toFixed(2)}
                    </Typography>
                    <div className={styles.favoriteActions}>
                      <Button 
                        variant="ghost" 
                        size="small"
                        severity="danger"
                        onClick={() => openRemoveModal(item)}
                      >
                        Remove
                      </Button>
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
                        Order
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
                  <div className={styles.itemDetailsFooter}>
                    <Typography variant="body2" className={styles.lastOrdered}>
                      Last ordered: {selectedItem.lastOrdered}
                    </Typography>
                    <Typography variant="h6" className={styles.itemDetailsPrice}>
                      ${selectedItem.price.toFixed(2)}
                    </Typography>
                  </div>
                </div>
              </div>
            </ModalContent>
            <ModalFooter>
              <Button 
                variant="secondary" 
                severity="danger"
                onClick={() => {
                  closeItemDetailsModal();
                  openRemoveModal(selectedItem);
                }}
              >
                Remove from Favorites
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  addToCart(selectedItem);
                  closeItemDetailsModal();
                }}
              >
                Add to Cart
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
      
      {/* Remove Favorite Modal */}
      <Modal
        open={isRemoveModalOpen}
        onClose={closeRemoveModal}
        size="small"
      >
        <ModalHeader 
          title="Remove from Favorites" 
          onClose={closeRemoveModal} 
        />
        <ModalContent>
          {selectedItem && (
            <Typography variant="body1">
              Are you sure you want to remove <strong>{selectedItem.name}</strong> from your favorites?
            </Typography>
          )}
        </ModalContent>
        <ModalFooter
          cancelText="Cancel"
          confirmText="Remove"
          onCancel={closeRemoveModal}
          onConfirm={removeFavorite}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default Favorites;
