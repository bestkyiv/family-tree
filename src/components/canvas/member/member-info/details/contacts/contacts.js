import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './contacts.scss';

import telegramIcon from './images/telegram.svg';
import emailIcon from './images/email.svg';
import phoneIcon from './images/phone.svg';

const propTypes = {
  telegram: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.string,
  isCollapsed: PropTypes.bool,
};

const defaultProps = {
  isCollapsed: false,
}

const Contacts = ({
  telegram,
  email,
  phone,
  isCollapsed,
}) => telegram || email || phone ? (
  <div className={classnames('contacts', {'contacts_collapsed': isCollapsed})}>
    {telegram &&
      <a
        href={`https://${telegram}`}
        target="_blank"
        rel="noreferrer"
      >
        <img src={telegramIcon} alt="Telegram" className="contacts__icon"/>
      </a>}
    {email &&
      <a
        href={`mailto:${email}`}
        target="_blank"
        rel="noreferrer"
      >
        <img src={emailIcon} alt="Email" className="contacts__icon"/>
      </a>}
    {phone &&
      <a href={`tel:${phone}`}>
        <img src={phoneIcon} alt="Phone" className="contacts__icon"/>
      </a>}
  </div>
) : null;

Contacts.propTypes = propTypes;
Contacts.defaultProps = defaultProps;

export default Contacts;
