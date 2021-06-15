import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {resetHighlightedMemberAction} from 'store/reducer';
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
  const [areDetailsShown, setAreDetailsShown] = useState(false);
  const [isHistoryShown, setIsHistoryShown] = useState(false);
  const [transitionStarted, setTransitionStarted] = useState(false);

  const dispatch = useDispatch();

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
      setAreDetailsShown(false);
      setIsHistoryShown(false)
    }
  }, [isCollapsed]);

  // Приховати історію якщо ховаються деталі
  useEffect(() => {
    if (!areDetailsShown) {
      setIsHistoryShown(false)
    }
  }, [areDetailsShown]);

  // Навести фокус на мембера, якщо він став виділеним, або відкрились його деталі
  useEffect(() => {
    if (highlighted || areDetailsShown) {
      setTransitionStarted(true);
    }
  }, [highlighted, areDetailsShown]);

  const showDetails = () => {
    setAreDetailsShown(true);
  }

  const hideDetails = e => {
    e.stopPropagation();
    setAreDetailsShown(false);
  }

  return (
    <div
      ref={memberInfoRef}
      className={classnames('member-info', {
        'member-info_collapsed': isCollapsed,
        'member-info_details-shown': areDetailsShown,
        'member-info_highlighted': highlighted,
      })}
      onClick={showDetails}
      onTransitionEnd={handleTransitionEnd}
      onMouseDown={e => e.stopPropagation()}
      onKeyPress={e => e.key === 'Enter' && !areDetailsShown ? showDetails() : null}
      tabIndex={0}
      onBlur={() => dispatch(resetHighlightedMemberAction())}
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
          isCollapsed={isCollapsed || !areDetailsShown}
        />
      </div>
      {history.length > 0 && (
        <div className="member-info__history">
          <button
              className={classnames('member-info__history-toggle', {
                'member-info__history-toggle_collapsed': isCollapsed || !areDetailsShown,
              })}
              onClick={() => setIsHistoryShown(!isHistoryShown)}
          >
            {isHistoryShown ? 'Приховати історію' : 'Показати історію'}
          </button>
          <ul className={classnames('member-info__history-content', {
            'member-info__history-content_shown': isHistoryShown,
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
