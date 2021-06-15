import React, {useEffect, useState} from 'react';
import classnames from 'classnames';

import GeneralInfo from './general-info/generalInfo';
import Details from './details/details'

import './memberInfo.scss';

const MemberInfo = ({
  picture,
  name,
  status,
  details,
  activity,
  history,
  isCollapsed,
  highlighted,
}) => {
  const [areDetailsCollapsed, setAreDetailsCollapsed] = useState(true);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(true);
  const [transitionStarted, setTransitionStarted] = useState(false);

  const memberInfoRef = React.createRef();

  const handleTransitionEnd = () => {
    if (transitionStarted) {
      memberInfoRef.current.scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: 'smooth',
      });
      setTransitionStarted(false);
    }
  }

  // Приховати деталі якщо мембер приховується
  useEffect(() => {
    if (isCollapsed) {
      setAreDetailsCollapsed(true);
      setIsHistoryCollapsed(true);
    }
  }, [isCollapsed]);

  // Приховати історію якщо ховаються деталі
  useEffect(() => {
    if (areDetailsCollapsed) {
      setIsHistoryCollapsed(true);
    }
  }, [areDetailsCollapsed]);

  // Навести фокус на мембера, якщо він став виділеним, або відкрились його деталі
  useEffect(() => {
    if (highlighted || !areDetailsCollapsed) {
      setTransitionStarted(true);
    }
  }, [highlighted, areDetailsCollapsed]);

  const showDetails = () => {
    setAreDetailsCollapsed(false);
  }

  const hideDetails = e => {
    e.stopPropagation();
    setAreDetailsCollapsed(true);
  }

  return (
    <div
      ref={memberInfoRef}
      className={classnames('member-info', {
        'member-info_collapsed': isCollapsed,
        'member-info_details-collapsed': areDetailsCollapsed,
        'member-info_highlighted': highlighted,
      })}
      onClick={showDetails}
      onTransitionEnd={handleTransitionEnd}
      onMouseDown={e => e.stopPropagation()}
      onKeyPress={e => e.key === 'Enter' && showDetails()}
      tabIndex={0}
    >
      <div className="member-info__content">
        <GeneralInfo
          picture={picture}
          name={name}
          status={status}
          isCollapsed={isCollapsed}
          activity={activity}
          highlighted={highlighted}
          handleClick={showDetails}
        />
        <Details
          {...details}
          isCollapsed={isCollapsed || areDetailsCollapsed}
        />
      </div>
      {history.length > 0 && (
        <div className="member-info__history">
          <button
              className={classnames('member-info__history-toggle', {
                'member-info__history-toggle_collapsed': isCollapsed || areDetailsCollapsed,
              })}
              onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
          >
            {isHistoryCollapsed ? 'Показати історію' : 'Приховати історію'}
          </button>
          <ul className={classnames('member-info__history-content', {
            'member-info__history-content_collapsed': isHistoryCollapsed,
          })}>
            {history.map((item, itemId) => <li key={itemId}>{item}</li>)}
          </ul>
        </div>
      )}
      <button
        className="member-info__close-details-button"
        onClick={hideDetails}
      >x</button>
    </div>
  );
}

export default MemberInfo;
