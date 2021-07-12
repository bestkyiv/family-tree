import React, { Fragment, FunctionComponent, KeyboardEvent } from 'react';

import './result.scss';

type Props = {
  query: string,
  name: string,
  status: string,
  onClick: () => void,
};

const Result: FunctionComponent<Props> = ({
  query,
  name,
  status,
  onClick,
}) => {
  const buttonRef = React.createRef<HTMLButtonElement>();

  const handleKeyUp = ({ key }: KeyboardEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    if (key === 'ArrowUp') {
      (buttonRef.current.previousElementSibling as HTMLElement).focus();
    } else if (key === 'ArrowDown') {
      (buttonRef.current.nextElementSibling as HTMLElement).focus();
    }
  };

  const highlightQueryInName = (value: string) => {
    const parts = value.split(new RegExp(`(${query})`, 'gi'));
    return parts
      .map((part, partId) => (
        // список статичний
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={partId}>
          {part.toLowerCase() === query.toLowerCase() ? <span className="result__bold">{part}</span> : part}
        </Fragment>
      ));
  };

  return (
    <button
      type="button"
      ref={buttonRef}
      className="result"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onKeyUp={handleKeyUp}
      role="link"
    >
      <span className="result__name">
        {highlightQueryInName(name)}
      </span>
      <span className="result__status">{`(${status})`}</span>
    </button>
  );
};

export default Result;
