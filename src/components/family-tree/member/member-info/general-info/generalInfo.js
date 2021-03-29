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
  withActivityIndicator: PropTypes.bool,
  highlighted: PropTypes.bool,
  handleClick: PropTypes.func,
};

const defaultProps = {
  isCollapsed: false,
  picture: null,
  withActivityIndicator: false,
  highlighted: false,
  handleClick: null,
}

class GeneralInfo extends Component {
  render() {
    const {
      picture,
      name,
      status,
      withActivityIndicator,
      isCollapsed,
      highlighted,
      handleClick,
    } = this.props;

    const generalInfoClasses = classnames('general-info', {
      'general-info_with-activity-indicator': withActivityIndicator,
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
        <div className="general-info__name">{name}</div>
        <div className="general-info__status">{status}</div>
      </div>
    );
  }
}

GeneralInfo.propTypes = propTypes;
GeneralInfo.defaultProps = defaultProps;

export default GeneralInfo;
