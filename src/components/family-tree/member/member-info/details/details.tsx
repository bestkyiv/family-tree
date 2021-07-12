import React, { FunctionComponent } from 'react';
import classnames from 'classnames';
import moment from 'moment';

import { MemberDetailsType, MembershipValueType } from 'config/memberType';

import Contacts from './contacts/contacts';

import './details.scss';

type Props = MemberDetailsType & {
  isCollapsed: boolean,
};

type DetailsItem = {
  capture: string,
  value: MembershipValueType,
};

const Details: FunctionComponent<Props> = ({
  membership,
  recDate,
  birthday,
  faculty,
  family,
  contacts,
  isCollapsed,
}) => {
  const detailsItems: Array<DetailsItem> = [];

  if (membership) {
    if (membership.board) {
      detailsItems.push({
        capture: 'Board',
        value: [{ value: membership.board }],
      });
    }

    if (membership.projects && membership.projects.length > 0) {
      membership.projects.forEach((project) => {
        if (project.addition) {
          detailsItems.push({
            capture: project.value,
            value: [{ value: project.addition }],
          });
        }
      });
    }

    if (membership.departments && membership.departments.length > 0) {
      detailsItems.push({
        capture: 'Відділи та команди',
        value: membership.departments,
      });
    }

    if (membership.internationalDeps && membership.internationalDeps.length > 0) {
      detailsItems.push({
        capture: 'Міжнар відділи та проекти',
        value: membership.internationalDeps,
      });
    }

    if (membership.internationalEvents && membership.internationalEvents.length > 0) {
      detailsItems.push({
        capture: 'Міжнар івенти',
        value: membership.internationalEvents,
      });
    }
  }

  if (birthday) {
    const roundingDefault = moment.relativeTimeRounding();
    moment.relativeTimeRounding(Math.floor);
    detailsItems.push({
      capture: 'День народження',
      value: [{ value: birthday.format('DD.MM.YYYY'), addition: birthday.fromNow(true) }],
    });
    moment.relativeTimeRounding(roundingDefault);
  }

  if (recDate) {
    detailsItems.push({
      capture: 'Рекрутмент',
      value: [{ value: recDate.format('DD.MM.YYYY'), addition: recDate.fromNow() }],
    });
  }

  if (faculty) {
    detailsItems.push({
      capture: 'Факультет',
      value: [{ value: faculty }],
    });
  }

  if (family) {
    detailsItems.push({
      capture: 'Сім\'я',
      value: [{ value: family }],
    });
  }

  return (
    <div className={classnames('details', { details_collapsed: isCollapsed })}>
      {detailsItems.map((item, itemId) => (
        <div
          // список статичний
          // eslint-disable-next-line react/no-array-index-key
          key={itemId}
          className="details__item"
        >
          <div className="details__item-caption">{item.capture}</div>
          <div className="details__item-value">
            {
              item.value.map((part, partId) => (
                <span
                  // список статичний
                  // eslint-disable-next-line react/no-array-index-key
                  key={partId}
                  className="details__item-value-part"
                >
                  {part.value}
                  {part.addition && <span className="details__item-value-addition">{` (${part.addition})`}</span>}
                  {partId !== item.value.length - 1 && ','}
                </span>
              ))
            }
          </div>
        </div>
      ))}
      <Contacts
        telegram={contacts?.telegram}
        email={contacts?.email}
        phone={contacts?.phone}
        isCollapsed={isCollapsed}
      />
    </div>
  );
};

export default Details;
