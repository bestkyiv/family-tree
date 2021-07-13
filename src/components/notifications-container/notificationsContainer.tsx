import React, { FunctionComponent } from 'react';

import { useNotifications } from 'store/reducer';

import Notification from './notification/notification';

import './notificationsContainer.scss';

const NotificationsContainer: FunctionComponent = () => {
  const notifications = useNotifications();

  return (
    <div className="notifications-container">
      {notifications.reverse().map((notification) => (
        <Notification key={notification.id} id={notification.id}>{notification.body}</Notification>
      ))}
    </div>
  );
};

export default NotificationsContainer;
