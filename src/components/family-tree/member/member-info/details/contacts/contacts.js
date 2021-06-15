import React from 'react';
import classnames from 'classnames';

import './contacts.scss';

import telegramIcon from './images/telegram.svg';
import emailIcon from './images/email.svg';
import phoneIcon from './images/phone.svg';

const Contacts = ({
  telegram,
  email,
  phone,
  isCollapsed,
}) => telegram || email || phone ? (
  <div className={classnames('contacts', {'contacts_collapsed': isCollapsed})}>
    {telegram &&
      <a
        href={`https://t.me/${telegram.substring(1)}`}
        target="_blank"
        rel="noreferrer"
        className="contacts__link"
      >
        <img src={telegramIcon} alt="Telegram" className="contacts__icon"/>
      </a>}
    {email &&
      <a
        href={`mailto:${email}`}
        target="_blank"
        rel="noreferrer"
        className="contacts__link"
      >
        <img src={emailIcon} alt="Email" className="contacts__icon"/>
      </a>}
    {phone &&
      <a
        href={`tel:${phone}`}
        className="contacts__link"
      >
        <img src={phoneIcon} alt="Phone" className="contacts__icon"/>
      </a>}
  </div>
) : null;

export default Contacts;
