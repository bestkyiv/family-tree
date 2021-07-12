import React, { FunctionComponent, useEffect, useState } from 'react';
import classnames from 'classnames';

import { MemberDetailsType } from 'config/memberType';

import CloseButton from 'components/shared/close-button/closeButton';

import GeneralInfo from './general-info/generalInfo';
import Details from './details/details';

import './memberInfo.scss';

type Props = {
  picture?: string,
  name: string,
  status: string,
  activity?: {
    locally?: boolean,
    internationally?: boolean,
  },
  details?: MemberDetailsType,
  isCollapsed: boolean,
  highlighted: boolean,
};

const MemberInfo: FunctionComponent<Props> = ({
  picture,
  name,
  status,
  details,
  activity,
  isCollapsed,
  highlighted,
}) => {
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
    if (areDetailsCollapsed) {
      setAreDetailsCollapsed(false);
      setTransitionStarted(true);
    }
  };

  const hideDetails = () => {
    if (!areDetailsCollapsed) {
      setAreDetailsCollapsed(true);
      setIsHistoryCollapsed(true);
    }
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
      onTransitionEnd={handleTransitionEnd}
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
        {details && (
          <Details
            recDate={details.recDate}
            birthday={details.birthday}
            faculty={details.faculty}
            family={details.family}
            contacts={details.contacts}
            membership={details.membership}
            isCollapsed={isCollapsed || areDetailsCollapsed}
          />
        )}
      </div>
      {details?.history && (
        <div className="member-info__history">
          <button
            type="button"
            className={classnames('member-info__history-toggle', {
              'member-info__history-toggle_collapsed': isCollapsed || areDetailsCollapsed,
            })}
            onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
          >
            {isHistoryCollapsed ? 'Показати історію' : 'Приховати історію'}
          </button>
          <ul
            className={classnames('member-info__history-content', {
              'member-info__history-content_collapsed': isHistoryCollapsed,
            })}
          >
            {
              // список статичний
              // eslint-disable-next-line react/no-array-index-key
              details.history.map((item, itemId) => <li key={itemId}>{item}</li>)
            }
          </ul>
        </div>
      )}
      <CloseButton
        customClasses="member-info__close-button"
        onClose={hideDetails}
      />
    </div>
  );
};

export default MemberInfo;
