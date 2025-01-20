import React from 'react';

export interface NotificationItemProps {
    title: string;
    message: string;
    time: string;
    type: string;
}

export const NotificationItem = (props: NotificationItemProps) => {
    return (
        <div className="notification-item">
            <h4 className="notification-item-title">{props.title}</h4>
            <p className="notification-item-message">{props.message}</p>
            <p className="notification-item-time">{props.time}</p>
        </div>
    );
};
