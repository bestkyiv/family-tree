import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

import './loader.scss';

import bestLogo from './images/best-logo.svg';

type Props = {
  small?: boolean,
};

const Loader: FunctionComponent<Props> = ({ small }) => (
  <div className="loader">
    <img
      src={bestLogo}
      alt="Best Logo"
      className={classnames('loader__logo', { loader__logo_s: small })}
    />
  </div>
);

export default Loader;
