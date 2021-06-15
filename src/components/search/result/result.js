import React, {Fragment} from 'react';

import './result.scss';


const Result = ({query, name, status, onClick}) => {
  const buttonRef = React.createRef();

  const handleKeyUp = event => {
    if (event.key === 'ArrowUp') {
      if (buttonRef.current.previousElementSibling) {
        buttonRef.current.previousElementSibling.focus();
      }
    }
    else if (event.key === 'ArrowDown') {
      if (buttonRef.current.nextElementSibling) {
        buttonRef.current.nextElementSibling.focus();
      }
    }
  }

  const highlightQueryInName = name => {
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
