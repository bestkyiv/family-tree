import React from 'react';
import classnames from 'classnames';

import Contacts from './contacts/contacts';

import './details.scss';
import moment from "moment";

const Details = ({
  membership,
  recDate,
  birthday,
  faculty,
  family,
  contacts,
  isCollapsed,
}) => {
  const getDetailsItems = () => {
    const detailsItems = [];

    if (membership.board) {
      detailsItems.push({
        key: 'board',
        capture: 'Board',
        value: [membership.board],
      });
    }

    if (membership.projects.length > 0) {
      membership.projects.forEach((project, projectId) => {
        detailsItems.push({
          key: `project${projectId}`,
          capture: project.name,
          value: [project.position],
        });
      });
    }

    if (membership.departments.length > 0) {
      detailsItems.push({
        key: 'departments',
        capture: 'Відділи та команди',
        value: membership.departments,
      });
    }

    if (membership.internationalDeps.length > 0) {
      detailsItems.push({
        key: 'internationalDeps',
        capture: 'Міжнар відділи та проекти',
        value: membership.internationalDeps,
      });
    }

    if (membership.internationalEvents.length > 0) {
      detailsItems.push({
        key: 'internationalDeps',
        capture: 'Міжнар івенти',
        value: membership.internationalEvents,
      });
    }

    if (birthday.isValid()) {
      const roundingDefault = moment.relativeTimeRounding();
      moment.relativeTimeRounding(Math.floor);
      detailsItems.push({
        key: 'birthday',
        capture: 'День народження',
        value: [[birthday.format('DD.MM.YYYY'), birthday.fromNow(true)]],
      });
      moment.relativeTimeRounding(roundingDefault);
    }

    if (recDate.isValid()) {
      detailsItems.push({
        key: 'recDate',
        capture: 'Рекрутмент',
        value: [[recDate.format('DD.MM.YYYY'), recDate.fromNow()]],
      });
    }

    if (faculty) {
      detailsItems.push({
        key: 'faculty',
        capture: 'Факультет',
        value: [faculty],
      });
    }

    if (family) {
      detailsItems.push({
        key: 'family',
        capture: 'Сім\'я',
        value: [family],
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
              item.value.map((part, partId) => {
                const value = Array.isArray(part) ? part[0] : part;
                const addition = Array.isArray(part) ? part[1] : null;
                return (
                  <span
                      key={partId}
                      className="details__item-value-part"
                  >
                    {value}
                    {addition && <span className="details__item-value-addition"> ({addition})</span>}
                    {partId !== item.value.length - 1 && ','}
                  </span>
                );
              })
            }
          </div>
        </div>
      ))}
      <Contacts {...contacts} isCollapsed={isCollapsed}/>
    </div>
  );
}

export default Details;
