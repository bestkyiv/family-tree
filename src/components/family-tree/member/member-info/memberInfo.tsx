import React, {useEffect, useState} from 'react';
import classnames from 'classnames';

import CloseButton from 'components/shared/close-button/closeButton';

import GeneralInfo from './general-info/generalInfo';
import Details from './details/details'

import {MemberInfoType} from 'config/memberType';

import './memberInfo.scss';

type Props = MemberInfoType & {
  isCollapsed: boolean,
  highlighted: boolean,
};

const MemberInfo = ({
  picture,
  name,
  status,
  details,
  activity,
  isCollapsed,
  highlighted,
}: Props) => {
  const [areDetailsCollapsed, setAreDetailsCollapsed] = useState(true);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(true);
  const [transitionStarted, setTransitionStarted] = useState(false);

  const memberInfoRef = React.createRef<HTMLDivElement>();

  const handleTransitionEnd = () => {
    if (transitionStarted) {
      (memberInfoRef.current as HTMLElement).scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: 'smooth',
      });
      setTransitionStarted(false);
    }
  };
  
  const showDetails = () => {
    setAreDetailsCollapsed(false);
    setTransitionStarted(true);
  };
  
  const hideDetails = () => {
    setAreDetailsCollapsed(true);
    setIsHistoryCollapsed(true);
  };

  // Приховати деталі якщо мембер приховується
  useEffect(() => {
    if (isCollapsed) hideDetails();
  }, [isCollapsed]);

  // Навести фокус на мембера, якщо він став виділеним
  useEffect(() => {
    if (highlighted) {
      setTransitionStarted(true);
    }
  }, [highlighted]);

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
      onMouseDown={e => e.stopPropagation()} // не прокидати mousedown для того щоб не тригерився Canvas
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
        {details && <Details {...details} isCollapsed={isCollapsed || areDetailsCollapsed} />}
      </div>
      {details?.history && (
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
            {details.history.map((item, itemId) => <li key={itemId}>{item}</li>)}
          </ul>
        </div>
      )}
      <CloseButton
        customClasses="member-info__close-button"
        onClose={(e) => {
          e.stopPropagation();
          hideDetails()
        }}
      />
    </div>
  );
}

export default MemberInfo;
