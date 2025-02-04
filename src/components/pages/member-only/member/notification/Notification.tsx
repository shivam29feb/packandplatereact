// Notification module entry point
import React from 'react';

import './Notification.module.css';
import { NotificationItem } from '../../../../molecules/NotificationItem/NotificationItem';

const Notification = () => {
  const notifications = [
    {
      id: 1,
      type: 'success',
      message: 'You have successfully saved your recipe',
    },
    {
      id: 2,
      type: 'info',
      message:
        'Your recipe has been successfully shared with the following users',
    },
    {
      id: 3,
      type: 'danger',
      message:
        'An error occurred while saving your recipe, please try again later',
    },
  ];

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <NotificationItem
              type={notification.type}
              message={notification.message}
              key={notification.id} title={''} time={''}        />
      ))}
    </div>
  );
};

export default Notification;
