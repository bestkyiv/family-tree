import React, { FunctionComponent, useEffect, useState } from 'react';
import classnames from 'classnames';

import { useMemberChildren, useHighlightedMember } from 'store/reducer';

import { MemberInfoType } from 'config/memberType';

import MemberInfo from './member-info/memberInfo';
import ToggleButton from './toggle-button/toggleButton';

import './member.scss';

type Props = {
  info: MemberInfoType,
  isCollapsed?: boolean,
};

const Member: FunctionComponent<Props> = ({ info, isCollapsed = false }) => {
  const [areChildrenCollapsed, setAreChildrenCollapsed] = useState(true);

  const memberChildren = useMemberChildren(info.name);

  const highlightedMember = useHighlightedMember();

  const toggleAreChildrenCollapsed = () => setAreChildrenCollapsed(!areChildrenCollapsed);

  // приховати дітей, якщо мембер сам прихований
  useEffect(() => {
    if (isCollapsed) setAreChildrenCollapsed(true);
  }, [isCollapsed]);

  // відобразити дітей, якщо один з нащадків виділений
  useEffect(() => {
    if (highlightedMember.ancestorsIds.includes(info.id)) {
      setAreChildrenCollapsed(false);
    }
  }, [info.id, highlightedMember]);

  return (
    <div
      className={classnames('member', {
        'member_has-parent': info.parent,
        member_collapsed: isCollapsed,
      })}
    >
      <MemberInfo
        picture={info.picture}
        name={info.name}
        status={info.status}
        details={info.details}
        activity={info.activity}
        highlighted={highlightedMember.id === info.id}
        isCollapsed={isCollapsed}
      />
      {memberChildren.length > 0 && (
        <>
          <ToggleButton
            isOn={!areChildrenCollapsed}
            isCollapsed={isCollapsed}
            onClick={toggleAreChildrenCollapsed}
          />
          <div className="member__children">
            {memberChildren.map((childInfo: MemberInfoType) => (
              <Member key={childInfo.id} info={childInfo} isCollapsed={isCollapsed || areChildrenCollapsed} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Member;
