import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

import Picture from './picture/picture';

import './generalInfo.scss';

type Props = {
  picture?: string,
  name: string,
  status: string,
  activity?: {
    locally?: boolean,
    internationally?: boolean,
  },
  isCollapsed: boolean,
  highlighted: boolean,
  handleClick?: () => void,
};

const GeneralInfo: FunctionComponent<Props> = ({
  picture,
  name,
  status,
  activity,
  isCollapsed,
  highlighted,
  handleClick,
}) => (
  <div
    className={classnames('general-info', {
      'general-info_collapsed': isCollapsed,
      'general-info_highlighted': highlighted,
    })}
    onClick={handleClick}
    onKeyPress={({ key }) => key === 'Enter' && handleClick && handleClick()}
    role="checkbox"
    aria-checked="false"
    tabIndex={handleClick ? 0 : -1}
  >
    <Picture
      src={picture}
      isCollapsed={isCollapsed}
    />
    {activity?.locally && <div className="general-info__local-indicator" title="Мембер активний локально" />}
    {activity?.internationally && (
      <div className="general-info__international-indicator" title="Мембер активний на міжнарі" />
    )}
    <div className="general-info__name">{name}</div>
    <div className="general-info__status">{status}</div>
  </div>
);

export default GeneralInfo;
