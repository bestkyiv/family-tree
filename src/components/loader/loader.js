import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './loader.scss';

import bestLogo from './images/best-logo.svg';

const propTypes = {
  size: PropTypes.oneOf(['s', 'l']),
};

const Loader = ({size}) => (
  <div className="loader">
    <img
      src={bestLogo}
      alt="Best Logo"
      className={classnames('loader__logo', {
        'loader__logo_s': size === 's',
      })}
    />
  </div>
);

Loader.propTypes = propTypes;

export default Loader;
