import React, { Fragment, FunctionComponent, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  addNotification,
  resetHighlightedMemberAction,
  setHighlightedMemberAction,
  useBirthdayMembers,
  useFirstGeneration,
} from 'store/reducer';

import { MemberInfoType } from 'config/memberType';

import Loader from 'components/shared/loader/loader';

import Member from './member/member';

import './familyTree.scss';

const FamilyTree: FunctionComponent = () => {
  const firstGeneration = useFirstGeneration();
  const birthdayBesties = useBirthdayMembers();

  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener('click', () => dispatch(resetHighlightedMemberAction()));
    document.addEventListener('touchstart', () => dispatch(resetHighlightedMemberAction()));
    document.addEventListener('onKeyPress', () => dispatch(resetHighlightedMemberAction()));
  }, []);

  useEffect(() => {
    if (birthdayBesties.length > 0) {
      dispatch(addNotification({
        id: 'birthday',
        body: (
          <>
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
          </>
        ),
      }));
    }
  }, [birthdayBesties]);

  return !firstGeneration.length ? <Loader /> : (
    <div id="family-tree" className="members-container">
      {firstGeneration.map((memberInfo) => <Member key={memberInfo.id} info={memberInfo} />)}
    </div>
  );
};

export default FamilyTree;
