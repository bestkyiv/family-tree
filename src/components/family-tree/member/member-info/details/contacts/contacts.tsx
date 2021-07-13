import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

import { ContactsType } from 'config/memberType';

import './contacts.scss';

import telegramIcon from './images/telegram.svg';
import emailIcon from './images/email.svg';
import phoneIcon from './images/phone.svg';

type Props = ContactsType & {
  isCollapsed: boolean,
};

const Contacts: FunctionComponent<Props> = ({
  telegram,
  email,
  phone,
  isCollapsed,
}) => (
  (telegram || email || phone)
    ? (
      <div className={classnames('contacts', { contacts_collapsed: isCollapsed })}>
        {telegram && (
          <a
            href={`https://t.me/${telegram.substring(1)}`}
            target="_blank"
            rel="noreferrer"
            className="contacts__link"
          >
            <img src={telegramIcon} alt="Telegram" className="contacts__icon" />
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            target="_blank"
            rel="noreferrer"
            className="contacts__link"
          >
            <img src={emailIcon} alt="Email" className="contacts__icon" />
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="contacts__link"
          >
            <img src={phoneIcon} alt="Phone" className="contacts__icon" />
          </a>
        )}
      </div>
    ) : null
);

export default Contacts;
