import React, { FunctionComponent } from 'react';

import './closeButton.scss';

type Props = {
  onClose: () => void,
  customClasses?: string,
};

const CloseButton: FunctionComponent<Props> = ({ onClose, customClasses }) => (
  <button
    type="button"
    className={`close-button ${customClasses}`}
    onClick={(e) => {
      e.stopPropagation();
      onClose();
    }}
  >
    ✕
  </button>
);

export default CloseButton;
