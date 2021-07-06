import React, {MouseEvent} from 'react';

import './closeButton.scss';

type Props = {
  onClose: (e: MouseEvent) => void,
  customClasses?: string,
};

const CloseButton = ({onClose, customClasses}: Props) =>
  <button className={'close-button ' + customClasses} onClick={onClose}>✕</button>;

export default CloseButton;
