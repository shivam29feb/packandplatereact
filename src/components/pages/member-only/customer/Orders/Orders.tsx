import React, { useState } from 'react';
import styles from './Orders.module.css';
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
import Table, { TableHead, TableBody, TableRow, TableCell } from '../../../../molecules/Table/Table';

// Sample order data
const sampleOrders = [
  {
    id: 101,
    date: '2023-05-15',
    status: 'delivered',
    total: 42.97,
    items: [
      { id: 1, name: 'Pasta Carbonara', quantity: 2, price: 12.99 },
      { id: 3, name: 'Caesar Salad', quantity: 1, price: 9.99 },
      { id: 5, name: 'Beef Burger', quantity: 1, price: 10.99 }
    ],
    deliveryAddress: '123 Main St, Anytown, USA',
    paymentMethod: 'Credit Card',
    deliveryTime: '30 minutes',
    deliveredAt: '2023-05-15 19:45'
  },
  {
    id: 102,
    date: '2023-05-10',
    status: 'delivered',
    total: 27.98,
    items: [
      { id: 2, name: 'Chicken Tikka Masala', quantity: 1, price: 14.99 },
      { id: 3, name: 'Caesar Salad', quantity: 1, price: 9.99 },
      { id: 8, name: 'Greek Salad', quantity: 1, price: 8.99 }
    ],
    deliveryAddress: '123 Main St, Anytown, USA',
    paymentMethod: 'PayPal',
    deliveryTime: '45 minutes',
    deliveredAt: '2023-05-10 20:15'
  },
  {
    id: 103,
    date: '2023-05-05',
    status: 'cancelled',
    total: 56.96,
    items: [
      { id: 4, name: 'Margherita Pizza', quantity: 2, price: 11.99 },
      { id: 6, name: 'Pad Thai', quantity: 1, price: 13.99 },
      { id: 7, name: 'Sushi Platter', quantity: 1, price: 18.99 }
    ],
    deliveryAddress: '123 Main St, Anytown, USA',
    paymentMethod: 'Credit Card',
    cancellationReason: 'Customer requested cancellation'
  },
  {
    id: 104,
    date: '2023-05-20',
    status: 'processing',
    total: 32.98,
    items: [
      { id: 1, name: 'Pasta Carbonara', quantity: 1, price: 12.99 },
      { id: 4, name: 'Margherita Pizza', quantity: 1, price: 11.99 },
      { id: 8, name: 'Greek Salad', quantity: 1, price: 8.99 }
    ],
    deliveryAddress: '123 Main St, Anytown, USA',
    paymentMethod: 'Credit Card',
    estimatedDelivery: '2023-05-20 19:30'
  },
  {
    id: 105,
    date: '2023-05-18',
    status: 'in-transit',
    total: 38.97,
    items: [
      { id: 2, name: 'Chicken Tikka Masala', quantity: 2, price: 14.99 },
      { id: 8, name: 'Greek Salad', quantity: 1, price: 8.99 }
    ],
    deliveryAddress: '123 Main St, Anytown, USA',
    paymentMethod: 'PayPal',
    estimatedDelivery: '2023-05-18 20:00',
    currentLocation: 'In transit - 10 minutes away'
  }
];

const Orders: React.FC = () => {
  // State for order data
  const [orders, setOrders] = useState(sampleOrders);
  const [filteredOrders, setFilteredOrders] = useState(sampleOrders);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // State for modals
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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
    applyFilters(value, statusFilter, sortBy);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(value);
    applyFilters(searchTerm, value, sortBy);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    applyFilters(searchTerm, statusFilter, value);
  };

  const applyFilters = (search: string, status: string, sort: string) => {
    let filtered = [...orders];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(order =>
        order.id.toString().includes(search) ||
        order.items.some(item => item.name.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter(order => order.status === status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      switch (sort) {
        case 'date-desc':
          return dateB - dateA;
        case 'date-asc':
          return dateA - dateB;
        case 'total-desc':
          return b.total - a.total;
        case 'total-asc':
          return a.total - b.total;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  };

  // Handle modal actions
  const openOrderDetailsModal = (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailsModalOpen(true);
  };

  const closeOrderDetailsModal = () => {
    setIsOrderDetailsModalOpen(false);
    setSelectedOrder(null);
  };

  const openCancelOrderModal = (order: any) => {
    setSelectedOrder(order);
    setIsCancelOrderModalOpen(true);
  };

  const closeCancelOrderModal = () => {
    setIsCancelOrderModalOpen(false);
    setSelectedOrder(null);
  };

  // Handle order cancellation
  const cancelOrder = () => {
    if (!selectedOrder) return;

    // Update order status
    const updatedOrders = orders.map(order =>
      order.id === selectedOrder.id
        ? {
            ...order,
            status: 'cancelled',
            cancellationReason: 'Customer requested cancellation'
          }
        : order
    );

    setOrders(updatedOrders as any);
    setFilteredOrders(updatedOrders as any);

    // Close modal
    closeCancelOrderModal();
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'processing':
      case 'in-transit':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout
      title="My Orders"
      sidebarContent={<DashboardSidebar navItems={navItems} />}
    >
      <div className={styles.ordersContent}>
        <Card variant="elevated" className={styles.filtersCard}>
          <CardContent>
            <div className={styles.filtersContainer}>
              <div className={styles.searchContainer}>
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={handleSearch}
                  fullWidth
                />
              </div>

              <div className={styles.filterControls}>
                <Select
                  name="statusFilter"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'processing', label: 'Processing' },
                    { value: 'in-transit', label: 'In Transit' },
                    { value: 'delivered', label: 'Delivered' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                />

                <Select
                  name="sortBy"
                  value={sortBy}
                  onChange={handleSortChange}
                  options={[
                    { value: 'date-desc', label: 'Date (Newest First)' },
                    { value: 'date-asc', label: 'Date (Oldest First)' },
                    { value: 'total-desc', label: 'Total (High to Low)' },
                    { value: 'total-asc', label: 'Total (Low to High)' },
                  ]}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className={styles.ordersGrid}>
          {filteredOrders.length === 0 ? (
            <Card variant="elevated" className={styles.emptyStateCard}>
              <CardContent>
                <div className={styles.emptyState}>
                  <Typography variant="h6">No Orders Found</Typography>
                  <Typography variant="body1">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Try adjusting your filters to see more results.'
                      : 'You haven\'t placed any orders yet.'}
                  </Typography>
                  {!searchTerm && statusFilter === 'all' && (
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
            filteredOrders.map((order) => (
              <Card key={order.id} variant="elevated" className={styles.orderCard}>
                <CardContent>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderInfo}>
                      <Typography variant="h6">Order #{order.id}</Typography>
                      <Typography variant="body2">{order.date}</Typography>
                    </div>
                    <Badge
                      variant="filled"
                      color={getStatusBadgeColor(order.status)}
                    >
                      {order.status === 'in-transit' ? 'In Transit' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  <div className={styles.orderItems}>
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className={styles.orderItem}>
                        <Typography variant="body2">{item.quantity}x {item.name}</Typography>
                        <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <Typography variant="body2" className={styles.moreItems}>
                        +{order.items.length - 2} more items
                      </Typography>
                    )}
                  </div>

                  <div className={styles.orderFooter}>
                    <Typography variant="body1" className={styles.orderTotal}>
                      Total: <strong>${order.total.toFixed(2)}</strong>
                    </Typography>

                    <div className={styles.orderActions}>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => openOrderDetailsModal(order)}
                      >
                        View Details
                      </Button>

                      {(order.status === 'processing' || order.status === 'in-transit') && (
                        <Button
                          variant="ghost"
                          size="small"
                          severity="danger"
                          onClick={() => openCancelOrderModal(order)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <Modal
        open={isOrderDetailsModalOpen}
        onClose={closeOrderDetailsModal}
        size="medium"
      >
        {selectedOrder && (
          <>
            <ModalHeader
              title={`Order #${selectedOrder.id}`}
              onClose={closeOrderDetailsModal}
            />
            <ModalContent>
              <div className={styles.orderDetailsContainer}>
                <div className={styles.orderDetailsHeader}>
                  <div className={styles.orderDetailsInfo}>
                    <Typography variant="body2">Date: {selectedOrder.date}</Typography>
                    <Typography variant="body2">Payment Method: {selectedOrder.paymentMethod}</Typography>
                  </div>
                  <Badge
                    variant="filled"
                    color={getStatusBadgeColor(selectedOrder.status)}
                  >
                    {selectedOrder.status === 'in-transit' ? 'In Transit' : selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </div>

                {selectedOrder.status === 'processing' && (
                  <div className={styles.orderStatusInfo}>
                    <Typography variant="body2">
                      Your order is being prepared. Estimated delivery: {selectedOrder.estimatedDelivery}
                    </Typography>
                  </div>
                )}

                {selectedOrder.status === 'in-transit' && (
                  <div className={styles.orderStatusInfo}>
                    <Typography variant="body2">
                      Your order is on the way! {selectedOrder.currentLocation}
                    </Typography>
                  </div>
                )}

                {selectedOrder.status === 'delivered' && (
                  <div className={styles.orderStatusInfo}>
                    <Typography variant="body2">
                      Your order was delivered on {selectedOrder.deliveredAt}
                    </Typography>
                  </div>
                )}

                {selectedOrder.status === 'cancelled' && (
                  <div className={styles.orderStatusInfo}>
                    <Typography variant="body2">
                      Cancellation reason: {selectedOrder.cancellationReason}
                    </Typography>
                  </div>
                )}

                <div className={styles.orderDetailsSection}>
                  <Typography variant="h6">Delivery Address</Typography>
                  <Typography variant="body1">{selectedOrder.deliveryAddress}</Typography>
                </div>

                <div className={styles.orderDetailsSection}>
                  <Typography variant="h6">Order Items</Typography>
                  <Table variant="striped" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell header>Item</TableCell>
                        <TableCell header align="center">Quantity</TableCell>
                        <TableCell header align="right">Price</TableCell>
                        <TableCell header align="right">Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                          <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className={styles.orderTotal}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6">${selectedOrder.total.toFixed(2)}</Typography>
                </div>
              </div>
            </ModalContent>
            <ModalFooter>
              {(selectedOrder.status === 'processing' || selectedOrder.status === 'in-transit') && (
                <Button
                  variant="secondary"
                  severity="danger"
                  onClick={() => {
                    closeOrderDetailsModal();
                    openCancelOrderModal(selectedOrder);
                  }}
                >
                  Cancel Order
                </Button>
              )}
              <Button
                variant="primary"
                onClick={closeOrderDetailsModal}
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* Cancel Order Modal */}
      <Modal
        open={isCancelOrderModalOpen}
        onClose={closeCancelOrderModal}
        size="small"
      >
        <ModalHeader
          title="Cancel Order"
          onClose={closeCancelOrderModal}
        />
        <ModalContent>
          {selectedOrder && (
            <Typography variant="body1">
              Are you sure you want to cancel order #{selectedOrder.id}? This action cannot be undone.
            </Typography>
          )}
        </ModalContent>
        <ModalFooter
          cancelText="No, Keep Order"
          confirmText="Yes, Cancel Order"
          onCancel={closeCancelOrderModal}
          onConfirm={cancelOrder}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default Orders;
