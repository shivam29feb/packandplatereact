import React, { useState } from 'react';
import styles from './SettingsForm.module.css';
import Card, { CardHeader, CardContent } from '../../molecules/Card/Card';
import Button from '../../atoms/Button/Button';
import Typography from '../../atoms/Typography/Typography';
import Input from '../../atoms/Input/Input';
import Select from '../../atoms/Select/Select';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import Divider from '../../atoms/Divider/Divider';
import Modal, { ModalHeader, ModalContent, ModalFooter } from '../../molecules/Modal/Modal';

export interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface PrivacySetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface AppearanceSetting {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
}

interface SettingsFormProps {
  /**
   * Notification settings
   */
  notificationSettings: NotificationSetting[];
  
  /**
   * Privacy settings
   */
  privacySettings: PrivacySetting[];
  
  /**
   * Appearance settings
   */
  appearanceSettings: AppearanceSetting;
  
  /**
   * Callback for when notification settings are updated
   */
  onNotificationSettingsChange?: (settings: NotificationSetting[]) => void;
  
  /**
   * Callback for when privacy settings are updated
   */
  onPrivacySettingsChange?: (settings: PrivacySetting[]) => void;
  
  /**
   * Callback for when appearance settings are updated
   */
  onAppearanceSettingsChange?: (settings: AppearanceSetting) => void;
  
  /**
   * Callback for when the account deletion is requested
   */
  onDeleteAccount?: () => void;
  
  /**
   * Additional sections to render
   */
  additionalSections?: React.ReactNode;
}

/**
 * SettingsForm component for managing user settings
 */
const SettingsForm: React.FC<SettingsFormProps> = ({
  notificationSettings,
  privacySettings,
  appearanceSettings,
  onNotificationSettingsChange,
  onPrivacySettingsChange,
  onAppearanceSettingsChange,
  onDeleteAccount,
  additionalSections,
}) => {
  // State for settings
  const [notifications, setNotifications] = useState<NotificationSetting[]>(notificationSettings);
  const [privacy, setPrivacy] = useState<PrivacySetting[]>(privacySettings);
  const [appearance, setAppearance] = useState<AppearanceSetting>(appearanceSettings);
  
  // State for delete account modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  
  // Handle notification setting change
  const handleNotificationChange = (id: string, channel: 'email' | 'push' | 'sms', value: boolean) => {
    const updatedSettings = notifications.map(setting => 
      setting.id === id ? { ...setting, [channel]: value } : setting
    );
    
    setNotifications(updatedSettings);
    
    if (onNotificationSettingsChange) {
      onNotificationSettingsChange(updatedSettings);
    }
  };
  
  // Handle privacy setting change
  const handlePrivacyChange = (id: string, value: boolean) => {
    const updatedSettings = privacy.map(setting => 
      setting.id === id ? { ...setting, enabled: value } : setting
    );
    
    setPrivacy(updatedSettings);
    
    if (onPrivacySettingsChange) {
      onPrivacySettingsChange(updatedSettings);
    }
  };
  
  // Handle appearance setting change
  const handleAppearanceChange = (setting: keyof AppearanceSetting, value: any) => {
    const updatedSettings = {
      ...appearance,
      [setting]: value
    };
    
    setAppearance(updatedSettings);
    
    if (onAppearanceSettingsChange) {
      onAppearanceSettingsChange(updatedSettings);
    }
  };
  
  // Handle delete account modal
  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setDeleteConfirmation('');
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteConfirmation('');
  };
  
  const handleDeleteAccount = () => {
    if (deleteConfirmation !== 'DELETE') {
      alert('Please type DELETE to confirm account deletion');
      return;
    }
    
    if (onDeleteAccount) {
      onDeleteAccount();
    }
    
    closeDeleteModal();
  };
  
  return (
    <div className={styles.settingsFormContainer}>
      {/* Notification Settings */}
      <Card variant="elevated" className={styles.settingsCard}>
        <CardHeader 
          title={<Typography variant="h6">Notification Settings</Typography>}
        />
        <CardContent>
          <div className={styles.notificationSettings}>
            <div className={styles.notificationHeader}>
              <div className={styles.notificationLabel}>
                <Typography variant="body2" className={styles.columnHeader}>
                  Notification Type
                </Typography>
              </div>
              <div className={styles.notificationChannels}>
                <Typography variant="body2" className={styles.columnHeader}>
                  Email
                </Typography>
                <Typography variant="body2" className={styles.columnHeader}>
                  Push
                </Typography>
                <Typography variant="body2" className={styles.columnHeader}>
                  SMS
                </Typography>
              </div>
            </div>
            
            {notifications.map((setting) => (
              <div key={setting.id} className={styles.notificationItem}>
                <div className={styles.notificationLabel}>
                  <Typography variant="body1">{setting.label}</Typography>
                  <Typography variant="body2" color="secondary">{setting.description}</Typography>
                </div>
                <div className={styles.notificationChannels}>
                  <Checkbox
                    checked={setting.email}
                    onChange={(e) => handleNotificationChange(setting.id, 'email', e.target.checked)}
                  />
                  <Checkbox
                    checked={setting.push}
                    onChange={(e) => handleNotificationChange(setting.id, 'push', e.target.checked)}
                  />
                  <Checkbox
                    checked={setting.sms}
                    onChange={(e) => handleNotificationChange(setting.id, 'sms', e.target.checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Privacy Settings */}
      <Card variant="elevated" className={styles.settingsCard}>
        <CardHeader 
          title={<Typography variant="h6">Privacy Settings</Typography>}
        />
        <CardContent>
          <div className={styles.privacySettings}>
            {privacy.map((setting) => (
              <div key={setting.id} className={styles.privacyItem}>
                <div className={styles.privacyLabel}>
                  <Typography variant="body1">{setting.label}</Typography>
                  <Typography variant="body2" color="secondary">{setting.description}</Typography>
                </div>
                <div className={styles.privacyControl}>
                  <Checkbox
                    checked={setting.enabled}
                    onChange={(e) => handlePrivacyChange(setting.id, e.target.checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Appearance Settings */}
      <Card variant="elevated" className={styles.settingsCard}>
        <CardHeader 
          title={<Typography variant="h6">Appearance Settings</Typography>}
        />
        <CardContent>
          <div className={styles.appearanceSettings}>
            <div className={styles.formGroup}>
              <label htmlFor="theme">Theme</label>
              <Select
                id="theme"
                name="theme"
                value={appearance.theme}
                onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'system', label: 'System Default' },
                ]}
                fullWidth
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="fontSize">Font Size</label>
              <Select
                id="fontSize"
                name="fontSize"
                value={appearance.fontSize}
                onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ]}
                fullWidth
              />
            </div>
            
            <div className={styles.checkboxGroup}>
              <Checkbox
                id="reducedMotion"
                checked={appearance.reducedMotion}
                onChange={(e) => handleAppearanceChange('reducedMotion', e.target.checked)}
              />
              <label htmlFor="reducedMotion">Reduce motion (minimize animations)</label>
            </div>
            
            <div className={styles.checkboxGroup}>
              <Checkbox
                id="highContrast"
                checked={appearance.highContrast}
                onChange={(e) => handleAppearanceChange('highContrast', e.target.checked)}
              />
              <label htmlFor="highContrast">High contrast mode</label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Additional Sections */}
      {additionalSections}
      
      {/* Danger Zone */}
      <Card variant="elevated" className={styles.dangerCard}>
        <CardHeader 
          title={<Typography variant="h6">Danger Zone</Typography>}
        />
        <CardContent>
          <div className={styles.dangerZone}>
            <div className={styles.dangerItem}>
              <div className={styles.dangerInfo}>
                <Typography variant="body1">Delete Account</Typography>
                <Typography variant="body2" color="secondary">
                  Once you delete your account, there is no going back. Please be certain.
                </Typography>
              </div>
              <Button 
                variant="secondary" 
                severity="danger"
                onClick={openDeleteModal}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Account Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        size="small"
      >
        <ModalHeader 
          title="Delete Account" 
          onClose={closeDeleteModal} 
        />
        <ModalContent>
          <div className={styles.deleteModalContent}>
            <Typography variant="body1" className={styles.deleteWarning}>
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </Typography>
            
            <div className={styles.formGroup}>
              <label htmlFor="deleteConfirmation">
                Please type <strong>DELETE</strong> to confirm:
              </label>
              <Input
                id="deleteConfirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                fullWidth
              />
            </div>
          </div>
        </ModalContent>
        <ModalFooter
          cancelText="Cancel"
          confirmText="Delete Account"
          onCancel={closeDeleteModal}
          onConfirm={handleDeleteAccount}
        />
      </Modal>
    </div>
  );
};

export default SettingsForm;
