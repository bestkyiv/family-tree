import React from 'react';

import './closeButton.scss';

const CloseButton = ({onClose, customClasses}) =>
  <button className={'close-button ' + customClasses} onClick={onClose}>✕</button>;

export default CloseButton;
