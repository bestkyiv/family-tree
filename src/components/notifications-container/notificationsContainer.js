import React, {Fragment, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

import {resetHighlightedMemberAction, setHighlightedMemberAction} from 'store/reducer';

import Notification from './notification/notification';

import './notificationsContainer.scss';

const today = moment();

const NotificationsContainer = () => {
  const dispatch = useDispatch();

  const birthdayBesties = useSelector(state => state.membersList
    .filter(member =>
      member.details.birthday.date() === today.date()
      && member.details.birthday.month() === today.month()
    )
    .sort((member1, member2) => {
      if ((member1.activity.locally || member1.activity.internationally)
          && (member2.activity.locally || member2.activity.internationally)) {
        if (member1.details.recDate.isValid() && member2.details.recDate.isValid())
          return member2.details.recDate.diff(member1.details.recDate);

        return member1.name > member2.name ? 1 : -1;
      }

      if (member1.activity.locally && !member2.activity.locally) return -1;
      if (member1.activity.internationally && !member2.activity.locally && !member2.activity.internationally) return -1;

      return 0;
    })
  );

  useEffect(() => {
    document.addEventListener('mousedown', () => dispatch(resetHighlightedMemberAction()));
  }, [dispatch]);

  return (
    <div className="notifications-container">
      {birthdayBesties.length > 0 && (
        <Notification>
          <span>Сьогодні день народження в: </span>
          {birthdayBesties.map((member, orderId) => (
            <Fragment key={member.id}>
              <span
                className="notification__member-link"
                onClick={e => {
                  e.stopPropagation();
                  dispatch(setHighlightedMemberAction(member.id));
                }}
              >
                {member.name}
              </span>
              {orderId !== birthdayBesties.length - 1 && ', '}
            </Fragment>
          ))}
        </Notification>
      )}
    </div>
  );
};

export default NotificationsContainer;
