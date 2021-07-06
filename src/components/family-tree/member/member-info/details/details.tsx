import React from 'react';
import classnames from 'classnames';
import moment from 'moment';

import Contacts from './contacts/contacts';

import {MemberDetailsType, MembershipValueType} from 'config/memberType';

import './details.scss';

type Props = MemberDetailsType & {
  isCollapsed: boolean,
};

type DetailsItem = {
  key: string,
  capture: string,
  value: MembershipValueType,
};

const Details = ({
  membership,
  recDate,
  birthday,
  faculty,
  family,
  contacts,
  isCollapsed,
}: Props) => {
  const getDetailsItems = () => {
    const detailsItems: Array<DetailsItem> = [];
    
    if (membership) {
      if (membership.board) {
        detailsItems.push({
          key: 'board',
          capture: 'Board',
          value: membership.board,
        });
      }
  
      if (membership.projects?.length > 0) {
        membership.projects.forEach((project, projectId) => {
          if (project.addition) {
            detailsItems.push({
              key: `project${projectId}`,
              capture: project.value,
              value: [{value: project.addition}],
            });
          }
        });
      }
  
      if (membership.departments?.length > 0) {
        detailsItems.push({
          key: 'departments',
          capture: 'Відділи та команди',
          value: membership.departments,
        });
      }
  
      if (membership.internationalDeps?.length > 0) {
        detailsItems.push({
          key: 'internationalDeps',
          capture: 'Міжнар відділи та проекти',
          value: membership.internationalDeps,
        });
      }
  
      if (membership.internationalEvents?.length > 0) {
        detailsItems.push({
          key: 'internationalDeps',
          capture: 'Міжнар івенти',
          value: membership.internationalEvents,
        });
      }
    }

    if (birthday) {
      const roundingDefault = moment.relativeTimeRounding();
      moment.relativeTimeRounding(Math.floor);
      detailsItems.push({
        key: 'birthday',
        capture: 'День народження',
        value: [{value: birthday.format('DD.MM.YYYY'), addition: birthday.fromNow(true)}],
      });
      moment.relativeTimeRounding(roundingDefault);
    }

    if (recDate) {
      detailsItems.push({
        key: 'recDate',
        capture: 'Рекрутмент',
        value: [{value: recDate.format('DD.MM.YYYY'), addition:  recDate.fromNow()}],
      });
    }

    if (faculty) {
      detailsItems.push({
        key: 'faculty',
        capture: 'Факультет',
        value: [{value: faculty}],
      });
    }

    if (family) {
      detailsItems.push({
        key: 'family',
        capture: 'Сім\'я',
        value: [{value: family}],
      });
    }

    return detailsItems;
  }

  return (
    <div className={classnames('details', {'details_collapsed': isCollapsed})}>
      {getDetailsItems().map(item => (
        <div
          key={item.key}
          className="details__item"
        >
          <div className="details__item-caption">{item.capture}</div>
          <div className="details__item-value">
            {
              item.value.map((part, partId) => (
                <span
                    key={partId}
                    className="details__item-value-part"
                >
                  {part.value}
                  {part.addition && <span className="details__item-value-addition"> ({part.addition})</span>}
                  {partId !== item.value.length - 1 && ','}
                </span>
              ))
            }
          </div>
        </div>
      ))}
      <Contacts {...contacts} isCollapsed={isCollapsed}/>
    </div>
  );
}

export default Details;
