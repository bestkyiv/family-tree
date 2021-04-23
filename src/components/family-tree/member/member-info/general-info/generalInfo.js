import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { statusesType } from 'config/statuses';

import Picture from './picture/picture'

import './generalInfo.scss';

const propTypes = {
  picture: PropTypes.string,
  name: PropTypes.string.isRequired,
  status: statusesType.isRequired,
  isCollapsed: PropTypes.bool,
  activity: PropTypes.object,
  highlighted: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
};

const defaultProps = {
  isCollapsed: false,
  highlighted: false,
}

class GeneralInfo extends Component {
  render() {
    const {
      picture,
      name,
      status,
      activity,
      isCollapsed,
      highlighted,
      handleClick,
    } = this.props;

    const generalInfoClasses = classnames('general-info', {
      'general-info_collapsed': isCollapsed,
      'general-info_highlighted': highlighted,
    });

    return (
      <div
        className={generalInfoClasses}
        onClick={handleClick}
      >
        <Picture
          src={picture}
          isCollapsed={isCollapsed}
        />
        {activity.locally && <div className="general-info__local-indicator" title="Мембер активний локально" />}
        {activity.internationally && <div className="general-info__international-indicator" title="Мембер активний на міжнарі" />}
        <div className="general-info__name">{name}</div>
        <div className="general-info__status">{status}</div>
      </div>
    );
  }
}

GeneralInfo.propTypes = propTypes;
GeneralInfo.defaultProps = defaultProps;

export default GeneralInfo;
