import React, { useState } from 'react';
import styles from './ProfileForm.module.css';
import Card, { CardHeader, CardContent } from '../../molecules/Card/Card';
import Button from '../../atoms/Button/Button';
import Typography from '../../atoms/Typography/Typography';
import Input from '../../atoms/Input/Input';
import Avatar from '../../atoms/Avatar/Avatar';
import Divider from '../../atoms/Divider/Divider';
import Modal, { ModalHeader, ModalContent, ModalFooter } from '../../molecules/Modal/Modal';
import { UserType } from '../../../context/AuthContext';

interface ProfileFormProps {
  /**
   * The user data to display and edit
   */
  userData: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    type: UserType;
    avatar?: string;
    bio?: string;
    joinDate: string;
  };

  /**
   * Whether the form is in edit mode
   */
  isEditMode?: boolean;

  /**
   * Callback for when the form is submitted
   */
  onSubmit?: (userData: any) => void;

  /**
   * Callback for when the password change is requested
   */
  onPasswordChange?: (oldPassword: string, newPassword: string) => void;
}

/**
 * ProfileForm component for displaying and editing user profile information
 */
const ProfileForm: React.FC<ProfileFormProps> = ({
  userData,
  isEditMode = false,
  onSubmit,
  onPasswordChange,
}) => {
  // State for form data
  const [formData, setFormData] = useState(userData);
  const [editMode, setEditMode] = useState(isEditMode);
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    zipCode: '',
  });

  // State for password change
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;
    const errors = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      zipCode: '',
    };

    // Validate first name
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }

    // Validate username
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate phone (if provided)
    if (formData.phone && !/^[\d\s\-\(\)\+]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    // Validate zip code (if provided)
    if (formData.zipCode && !/^[\d\s\-]+$/.test(formData.zipCode)) {
      errors.zipCode = 'Please enter a valid zip code';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }

    setEditMode(false);
  };

  // Handle password modal
  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user types
    if (passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate password form
  const validatePasswordForm = (): boolean => {
    let isValid = true;
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    // Validate current password
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
      isValid = false;
    }

    // Validate new password
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    }

    // Validate confirm password
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  // Handle password form submission
  const handlePasswordSubmit = () => {
    if (!validatePasswordForm()) {
      return;
    }

    if (onPasswordChange) {
      onPasswordChange(passwordData.currentPassword, passwordData.newPassword);
    }

    closePasswordModal();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`;
    }
    return formData.username.charAt(0).toUpperCase();
  };

  return (
    <div className={styles.profileFormContainer}>
      <Card variant="elevated" className={styles.profileCard}>
        <CardHeader
          title={<Typography variant="h6">Profile Information</Typography>}
          action={
            !editMode ? (
              <Button
                variant="secondary"
                size="small"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            ) : null
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit} className={styles.profileForm}>
            <div className={styles.profileHeader}>
              <div className={styles.avatarSection}>
                <Avatar size="xlarge" variant="circular" src={formData.avatar}>
                  {getUserInitials()}
                </Avatar>
                {editMode && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => alert('Upload avatar functionality would go here')}
                  >
                    Change Avatar
                  </Button>
                )}
              </div>

              <div className={styles.userInfo}>
                <Typography variant="h5">
                  {formData.firstName} {formData.lastName}
                </Typography>
                <Typography variant="body1" color="secondary">
                  {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
                </Typography>
                <Typography variant="body2">
                  Member since {formData.joinDate}
                </Typography>
              </div>
            </div>

            <Divider />

            <div className={styles.formSection}>
              <Typography variant="h6" className={styles.sectionTitle}>
                Personal Information
              </Typography>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First Name</label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!editMode}
                    status={formErrors.firstName ? 'error' : 'default'}
                    helperText={formErrors.firstName}
                    fullWidth
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Last Name</label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!editMode}
                    status={formErrors.lastName ? 'error' : 'default'}
                    helperText={formErrors.lastName}
                    fullWidth
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="username">Username</label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!editMode}
                    status={formErrors.username ? 'error' : 'default'}
                    helperText={formErrors.username}
                    fullWidth
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editMode}
                    status={formErrors.email ? 'error' : 'default'}
                    helperText={formErrors.email}
                    fullWidth
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    status={formErrors.phone ? 'error' : 'default'}
                    helperText={formErrors.phone}
                    fullWidth
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="bio">Bio</label>
                  <Input
                    id="bio"
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    fullWidth
                  />
                </div>
              </div>
            </div>

            <Divider />

            <div className={styles.formSection}>
              <Typography variant="h6" className={styles.sectionTitle}>
                Address Information
              </Typography>

              <div className={styles.formGroup}>
                <label htmlFor="address">Address</label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="city">City</label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    fullWidth
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="state">State</label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    fullWidth
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="zipCode">Zip Code</label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    status={formErrors.zipCode ? 'error' : 'default'}
                    helperText={formErrors.zipCode}
                    fullWidth
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="country">Country</label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    fullWidth
                  />
                </div>
              </div>
            </div>

            <Divider />

            <div className={styles.formSection}>
              <Typography variant="h6" className={styles.sectionTitle}>
                Security
              </Typography>

              <Button
                variant="secondary"
                onClick={openPasswordModal}
              >
                Change Password
              </Button>
            </div>

            {editMode && (
              <div className={styles.formActions}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setFormData(userData);
                    setEditMode(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Password Change Modal */}
      <Modal
        open={isPasswordModalOpen}
        onClose={closePasswordModal}
        size="small"
      >
        <ModalHeader
          title="Change Password"
          onClose={closePasswordModal}
        />
        <ModalContent>
          <div className={styles.passwordForm}>
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword">Current Password</label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                status={passwordErrors.currentPassword ? 'error' : 'default'}
                helperText={passwordErrors.currentPassword}
                fullWidth
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="newPassword">New Password</label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                status={passwordErrors.newPassword ? 'error' : 'default'}
                helperText={passwordErrors.newPassword}
                fullWidth
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                status={passwordErrors.confirmPassword ? 'error' : 'default'}
                helperText={passwordErrors.confirmPassword}
                fullWidth
              />
            </div>
          </div>
        </ModalContent>
        <ModalFooter
          cancelText="Cancel"
          confirmText="Change Password"
          onCancel={closePasswordModal}
          onConfirm={handlePasswordSubmit}
        />
      </Modal>
    </div>
  );
};

export default ProfileForm;
