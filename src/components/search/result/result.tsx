import React, {Fragment, KeyboardEvent, MouseEvent} from 'react';

import './result.scss';

type Props = {
  query: string,
  name: string,
  status: string,
  onClick: (e: MouseEvent) => void,
};

const Result = ({query, name, status, onClick}: Props) => {
  const buttonRef = React.createRef<HTMLButtonElement>();

  const handleKeyUp = ({key}: KeyboardEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    if (key === 'ArrowUp') {
      (buttonRef.current.previousElementSibling as HTMLElement).focus();
    }
    else if (key === 'ArrowDown') {
      (buttonRef.current.nextElementSibling as HTMLElement).focus();
    }
  }

  const highlightQueryInName = (name: string) => {
    const parts = name.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, partId) => (
      <Fragment key={partId}>
        {part.toLowerCase() === query.toLowerCase() ? <b>{part}</b> : part}
      </Fragment>
    ));
  }

  return (
    <button
      ref={buttonRef}
      className="result"
      onClick={onClick}
      onKeyUp={handleKeyUp}
      onMouseDown={e => e.stopPropagation()}
    >
      <span className="result__name">
        {highlightQueryInName(name)}
      </span>
      <span className="result__status">
        ({status})
      </span>
    </button>
  );
}

export default Result;
