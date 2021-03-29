import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './placeholder.scss';

import bestLogo from './images/best-logo.svg';

const propTypes = {
  visible: PropTypes.bool,
};

const defaultProps = {
  visible: false,
}

class Placeholder extends Component {
  render() {
    const {visible} = this.props;

    const placeholderClasses = classnames('placeholder', {
      'placeholder_visible': visible,
    });

    return (
      <div className={placeholderClasses}>
        <img src={bestLogo} alt="Best Logo" className="placeholder__logo" />
      </div>
    );
  }
}

Placeholder.propTypes = propTypes;
Placeholder.defaultProps = defaultProps;

export default Placeholder;
