import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';

import { removeNotification } from 'store/reducer';

import CloseButton from 'components/shared/close-button/closeButton';

import './notification.scss';

type Props = {
  id: string,
};

const Notification: FunctionComponent<Props> = ({ id, children }) => {
  const [hasAppeared, setHasAppeared] = useState(false);
  const [transitionStarted, setTransitionStarted] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => setHasAppeared(true), 50);
  }, []);

  const close = () => {
    setHasAppeared(false);
    setTransitionStarted(true);
  };

  const handleTransitionEnd = () => {
    if (transitionStarted) {
      dispatch(removeNotification(id));
      setTransitionStarted(false);
    }
  };

  return (
    <div
      className={classnames('notification', { notification_hidden: !hasAppeared })}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
      <CloseButton onClose={close} customClasses="notification__close-button" />
    </div>
  );
};

export default Notification;
