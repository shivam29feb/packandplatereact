import React, { useState } from 'react';
import styles from './CustomerSettings.module.css';
import DashboardLayout from '../../../../templates/DashboardLayout/DashboardLayout';
import DashboardSidebar from '../../../../organisms/DashboardSidebar/DashboardSidebar';
import SettingsForm, { 
  NotificationSetting, 
  PrivacySetting, 
  AppearanceSetting 
} from '../../../../organisms/SettingsForm/SettingsForm';
import Card, { CardHeader, CardContent } from '../../../../molecules/Card/Card';
import Typography from '../../../../atoms/Typography/Typography';
import Input from '../../../../atoms/Input/Input';
import Select from '../../../../atoms/Select/Select';
import Button from '../../../../atoms/Button/Button';
import Checkbox from '../../../../atoms/Checkbox/Checkbox';
import { useAuth } from '../../../../../context/AuthContext';

// Sample notification settings
const sampleNotificationSettings: NotificationSetting[] = [
  {
    id: 'order-updates',
    label: 'Order Updates',
    description: 'Notify about order status changes',
    email: true,
    push: true,
    sms: true
  },
  {
    id: 'promotions',
    label: 'Promotions & Offers',
    description: 'Notify about special offers and promotions',
    email: true,
    push: false,
    sms: false
  },
  {
    id: 'new-dishes',
    label: 'New Dishes',
    description: 'Notify when new dishes are added',
    email: true,
    push: true,
    sms: false
  },
  {
    id: 'platform-updates',
    label: 'Platform Updates',
    description: 'Notify about platform updates and new features',
    email: true,
    push: false,
    sms: false
  }
];

// Sample privacy settings
const samplePrivacySettings: PrivacySetting[] = [
  {
    id: 'order-history',
    label: 'Order History',
    description: 'Allow us to use your order history for recommendations',
    enabled: true
  },
  {
    id: 'location',
    label: 'Location Services',
    description: 'Allow us to use your location for delivery and recommendations',
    enabled: true
  },
  {
    id: 'analytics',
    label: 'Analytics Collection',
    description: 'Allow us to collect anonymous usage data to improve the platform',
    enabled: true
  }
];

// Sample appearance settings
const sampleAppearanceSettings: AppearanceSetting = {
  theme: 'light',
  fontSize: 'medium',
  reducedMotion: false,
  highContrast: false
};

// Sample order settings
interface OrderSettings {
  defaultPaymentMethod: string;
  defaultDeliveryAddress: string;
  saveOrderHistory: boolean;
  autoTip: string;
  contactlessDelivery: boolean;
}

const sampleOrderSettings: OrderSettings = {
  defaultPaymentMethod: 'credit-card',
  defaultDeliveryAddress: 'home',
  saveOrderHistory: true,
  autoTip: '15',
  contactlessDelivery: true
};

const CustomerSettings: React.FC = () => {
  // State for settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>(sampleNotificationSettings);
  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>(samplePrivacySettings);
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSetting>(sampleAppearanceSettings);
  const [orderSettings, setOrderSettings] = useState<OrderSettings>(sampleOrderSettings);
  
  // Get auth context
  const { user } = useAuth();
  
  // Navigation items for the sidebar
  const navItems = [
    { label: 'Dashboard', path: '/customer/dashboard' },
    { label: 'Browse Menu', path: '/customer/menu' },
    { label: 'My Orders', path: '/customer/orders' },
    { label: 'Favorites', path: '/customer/favorites' },
    { label: 'Profile', path: '/customer/profile' },
  ];
  
  // Handle order settings change
  const handleOrderSettingChange = (setting: keyof OrderSettings, value: any) => {
    setOrderSettings({
      ...orderSettings,
      [setting]: value
    });
  };
  
  // Handle save order settings
  const handleSaveOrderSettings = () => {
    // In a real app, this would send the updated settings to the server
    alert('Order settings saved successfully!');
  };
  
  // Handle account deletion
  const handleDeleteAccount = () => {
    // In a real app, this would send the account deletion request to the server
    alert('Account deletion functionality would go here');
  };
  
  // Additional sections for customer settings
  const additionalSections = (
    <Card variant="elevated" className={styles.settingsCard}>
      <CardHeader 
        title={<Typography variant="h6">Order Settings</Typography>}
      />
      <CardContent>
        <div className={styles.orderSettings}>
          <div className={styles.formGroup}>
            <label htmlFor="defaultPaymentMethod">Default Payment Method</label>
            <Select
              id="defaultPaymentMethod"
              name="defaultPaymentMethod"
              value={orderSettings.defaultPaymentMethod}
              onChange={(e) => handleOrderSettingChange('defaultPaymentMethod', e.target.value)}
              options={[
                { value: 'credit-card', label: 'Credit Card' },
                { value: 'paypal', label: 'PayPal' },
                { value: 'cash', label: 'Cash on Delivery' },
              ]}
              fullWidth
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="defaultDeliveryAddress">Default Delivery Address</label>
            <Select
              id="defaultDeliveryAddress"
              name="defaultDeliveryAddress"
              value={orderSettings.defaultDeliveryAddress}
              onChange={(e) => handleOrderSettingChange('defaultDeliveryAddress', e.target.value)}
              options={[
                { value: 'home', label: 'Home' },
                { value: 'work', label: 'Work' },
                { value: 'other', label: 'Other' },
              ]}
              fullWidth
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="autoTip">Default Tip Percentage</label>
            <Select
              id="autoTip"
              name="autoTip"
              value={orderSettings.autoTip}
              onChange={(e) => handleOrderSettingChange('autoTip', e.target.value)}
              options={[
                { value: '0', label: 'No Tip' },
                { value: '10', label: '10%' },
                { value: '15', label: '15%' },
                { value: '20', label: '20%' },
                { value: '25', label: '25%' },
              ]}
              fullWidth
            />
          </div>
          
          <div className={styles.checkboxGroup}>
            <Checkbox
              id="saveOrderHistory"
              checked={orderSettings.saveOrderHistory}
              onChange={(e) => handleOrderSettingChange('saveOrderHistory', e.target.checked)}
            />
            <label htmlFor="saveOrderHistory">Save order history for quick reordering</label>
          </div>
          
          <div className={styles.checkboxGroup}>
            <Checkbox
              id="contactlessDelivery"
              checked={orderSettings.contactlessDelivery}
              onChange={(e) => handleOrderSettingChange('contactlessDelivery', e.target.checked)}
            />
            <label htmlFor="contactlessDelivery">Prefer contactless delivery</label>
          </div>
          
          <div className={styles.formActions}>
            <Button 
              variant="primary"
              onClick={handleSaveOrderSettings}
            >
              Save Order Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <DashboardLayout
      title="Customer Settings"
      sidebarContent={<DashboardSidebar navItems={navItems} />}
    >
      <div className={styles.settingsContainer}>
        <SettingsForm 
          notificationSettings={notificationSettings}
          privacySettings={privacySettings}
          appearanceSettings={appearanceSettings}
          onNotificationSettingsChange={setNotificationSettings}
          onPrivacySettingsChange={setPrivacySettings}
          onAppearanceSettingsChange={setAppearanceSettings}
          onDeleteAccount={handleDeleteAccount}
          additionalSections={additionalSections}
        />
      </div>
    </DashboardLayout>
  );
};

export default CustomerSettings;
