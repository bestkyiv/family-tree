import React, { FunctionComponent, useState } from 'react';
import classnames from 'classnames';

import './toggleButton.scss';

type Props = {
  isOn: boolean,
  onClick: () => void,
  isCollapsed: boolean,
};

const ToggleButton: FunctionComponent<Props> = ({ isOn, onClick, isCollapsed }: Props) => {
  const [transitionStarted, setTransitionStarted] = useState(false);

  const toggleButtonRef = React.createRef<HTMLButtonElement>();

  const handleClick = () => {
    onClick();
    setTransitionStarted(true); // виконати handleTransitionEnd після завершення transition
  };

  const handleTransitionEnd = () => {
    if (transitionStarted && toggleButtonRef && toggleButtonRef.current) {
      toggleButtonRef.current.scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: 'smooth',
      });
      setTransitionStarted(false);
    }
  };

  return (
    <button
      type="button"
      ref={toggleButtonRef}
      className={classnames('toggle-button', {
        'toggle-button_collapsed': isCollapsed,
        'toggle-button_on': isOn,
      })}
      onClick={handleClick}
      onTransitionEnd={handleTransitionEnd}
      onMouseDown={(e) => e.stopPropagation()} // не прокидати mousedown для того щоб не тригерився Canvas
    >
      {isOn ? '-' : '+'}
    </button>
  );
};

export default ToggleButton;
