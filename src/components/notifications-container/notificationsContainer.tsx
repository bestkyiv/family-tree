import React, { Fragment, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { setHighlightedMemberAction, useBirthdayMembers } from 'store/reducer';

import { MemberInfoType } from 'config/memberType';

import Notification from './notification/notification';

import './notificationsContainer.scss';

const NotificationsContainer: FunctionComponent = () => {
  const dispatch = useDispatch();

  const birthdayBesties = useBirthdayMembers();

  return (
    <div className="notifications-container">
      {birthdayBesties.length > 0 && (
        <Notification>
          <span>Сьогодні день народження в: </span>
          {birthdayBesties.map((memberInfo: MemberInfoType, orderId: number) => (
            <Fragment key={memberInfo.id}>
              <span
                className="notification__member-link"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setHighlightedMemberAction(memberInfo.id));
                }}
                onKeyPress={({ key }) => key === 'Enter' && dispatch(setHighlightedMemberAction(memberInfo.id))}
                role="link"
                tabIndex={0}
              >
                {memberInfo.name}
              </span>
              {` (${memberInfo.details?.birthday?.fromNow(true)})`}
              {orderId !== birthdayBesties.length - 1 && ', '}
            </Fragment>
          ))}
        </Notification>
      )}
    </div>
  );
};

export default NotificationsContainer;
