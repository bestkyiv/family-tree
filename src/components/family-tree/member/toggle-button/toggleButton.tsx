import React, {useState} from 'react';
import classnames from 'classnames';

import './toggleButton.scss';

type Props = {
  isOn: boolean,
  onClick: () => void,
  isCollapsed: boolean,
};

const ToggleButton = ({isOn, onClick, isCollapsed}: Props) => {
  const [transitionStarted, setTransitionStarted] = useState(false);

  const toggleButtonRef = React.createRef<HTMLButtonElement>();

  const handleClick = () => {
    onClick();
    setTransitionStarted(true); // виконати handleTransitionEnd після завершення transition
  };

  const handleTransitionEnd = () => {
    if (transitionStarted) {
      (toggleButtonRef.current as HTMLElement).scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: 'smooth',
      });
      setTransitionStarted(false);
    }
  };

  return (
    <button
      ref={toggleButtonRef}
      className={classnames('toggle-button', {
        'toggle-button_collapsed': isCollapsed,
        'toggle-button_on': isOn,
      })}
      onClick={handleClick}
      onTransitionEnd={handleTransitionEnd}

      // не прокидати mouseup і mousedown для того щоб не тригерився Canvas
      onMouseDown={e => e.stopPropagation()}
      onMouseUp={e => e.stopPropagation()}
    >
      {isOn ? '-' : '+'}
    </button>
  );
};

export default ToggleButton;
