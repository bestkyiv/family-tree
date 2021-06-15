import React, {useState} from 'react';
import classnames from 'classnames';

import './toggleButton.scss';


const ToggleButton = ({isOn, isCollapsed, onClick}) => {
  const [transitionStarted, setTransitionStarted] = useState(false);

  const toggleButtonRef = React.createRef();

  const handleClick = () => {
    onClick();

    // focus after transition
    setTransitionStarted(true);
  };

  const handleTransitionEnd = () => {
    if (transitionStarted) {
      toggleButtonRef.current.scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: 'smooth',
      });
      setTransitionStarted(false);
    }
  }

  return (
    <button
      ref={toggleButtonRef}
      className={classnames('toggle-button', {
        'toggle-button_collapsed': isCollapsed,
        'toggle-button_on': isOn,
      })}
      onClick={handleClick}
      onMouseDown={e => e.stopPropagation()}
      onTransitionEnd={handleTransitionEnd}
    >
      {isOn ? '-' : '+'}
    </button>
  );
}

export default ToggleButton;
