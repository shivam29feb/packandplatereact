import React, { useState } from 'react';
import styles from './MemberSettings.module.css';
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
    id: 'dish-approval',
    label: 'Dish Approval',
    description: 'Notify when your dish is approved or rejected',
    email: true,
    push: true,
    sms: false
  },
  {
    id: 'dish-orders',
    label: 'Dish Orders',
    description: 'Notify when someone orders your dish',
    email: true,
    push: true,
    sms: false
  },
  {
    id: 'dish-reviews',
    label: 'Dish Reviews',
    description: 'Notify when someone reviews your dish',
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
    id: 'profile-visibility',
    label: 'Profile Visibility',
    description: 'Make your profile visible to other users',
    enabled: true
  },
  {
    id: 'dish-statistics',
    label: 'Dish Statistics',
    description: 'Share your dish statistics with other members',
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

// Sample dish settings
interface DishSettings {
  defaultCategory: string;
  autoPublish: boolean;
  showNutritionalInfo: boolean;
  allowReviews: boolean;
  defaultPriceRange: string;
}

const sampleDishSettings: DishSettings = {
  defaultCategory: 'Italian',
  autoPublish: false,
  showNutritionalInfo: true,
  allowReviews: true,
  defaultPriceRange: 'medium'
};

const MemberSettings: React.FC = () => {
  // State for settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>(sampleNotificationSettings);
  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>(samplePrivacySettings);
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSetting>(sampleAppearanceSettings);
  const [dishSettings, setDishSettings] = useState<DishSettings>(sampleDishSettings);
  
  // Get auth context
  const { user } = useAuth();
  
  // Navigation items for the sidebar
  const navItems = [
    { label: 'Dashboard', path: '/member/dashboard' },
    { label: 'My Dishes', path: '/member/dishes' },
    { label: 'Add New Dish', path: '/add-dish' },
    { label: 'Profile', path: '/member/profile' },
    { label: 'Settings', path: '/member/settings' },
  ];
  
  // Handle dish settings change
  const handleDishSettingChange = (setting: keyof DishSettings, value: any) => {
    setDishSettings({
      ...dishSettings,
      [setting]: value
    });
  };
  
  // Handle save dish settings
  const handleSaveDishSettings = () => {
    // In a real app, this would send the updated settings to the server
    alert('Dish settings saved successfully!');
  };
  
  // Handle account deletion
  const handleDeleteAccount = () => {
    // In a real app, this would send the account deletion request to the server
    alert('Account deletion functionality would go here');
  };
  
  // Additional sections for member settings
  const additionalSections = (
    <Card variant="elevated" className={styles.settingsCard}>
      <CardHeader 
        title={<Typography variant="h6">Dish Settings</Typography>}
      />
      <CardContent>
        <div className={styles.dishSettings}>
          <div className={styles.formGroup}>
            <label htmlFor="defaultCategory">Default Category</label>
            <Select
              id="defaultCategory"
              name="defaultCategory"
              value={dishSettings.defaultCategory}
              onChange={(e) => handleDishSettingChange('defaultCategory', e.target.value)}
              options={[
                { value: 'Italian', label: 'Italian' },
                { value: 'Indian', label: 'Indian' },
                { value: 'American', label: 'American' },
                { value: 'Japanese', label: 'Japanese' },
                { value: 'Thai', label: 'Thai' },
                { value: 'Mediterranean', label: 'Mediterranean' },
              ]}
              fullWidth
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="defaultPriceRange">Default Price Range</label>
            <Select
              id="defaultPriceRange"
              name="defaultPriceRange"
              value={dishSettings.defaultPriceRange}
              onChange={(e) => handleDishSettingChange('defaultPriceRange', e.target.value)}
              options={[
                { value: 'budget', label: 'Budget ($)' },
                { value: 'medium', label: 'Medium ($$)' },
                { value: 'premium', label: 'Premium ($$$)' },
              ]}
              fullWidth
            />
          </div>
          
          <div className={styles.checkboxGroup}>
            <Checkbox
              id="autoPublish"
              checked={dishSettings.autoPublish}
              onChange={(e) => handleDishSettingChange('autoPublish', e.target.checked)}
            />
            <label htmlFor="autoPublish">Auto-publish dishes (requires admin approval)</label>
          </div>
          
          <div className={styles.checkboxGroup}>
            <Checkbox
              id="showNutritionalInfo"
              checked={dishSettings.showNutritionalInfo}
              onChange={(e) => handleDishSettingChange('showNutritionalInfo', e.target.checked)}
            />
            <label htmlFor="showNutritionalInfo">Show nutritional information</label>
          </div>
          
          <div className={styles.checkboxGroup}>
            <Checkbox
              id="allowReviews"
              checked={dishSettings.allowReviews}
              onChange={(e) => handleDishSettingChange('allowReviews', e.target.checked)}
            />
            <label htmlFor="allowReviews">Allow customer reviews</label>
          </div>
          
          <div className={styles.formActions}>
            <Button 
              variant="primary"
              onClick={handleSaveDishSettings}
            >
              Save Dish Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <DashboardLayout
      title="Member Settings"
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

export default MemberSettings;
