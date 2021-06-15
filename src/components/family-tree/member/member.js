import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import classnames from 'classnames';

import sortingRule from 'utils/sortMembersRule';

import MemberInfo from './member-info/memberInfo';
import ToggleButton from './toggle-button/toggleButton';

import './member.scss';


const Member = ({id, isCollapsed = false}) => {
  const [areChildrenCollapsed, setAreChildrenCollapsed] = useState(true);

  const memberInfo = useSelector(state => state.membersList.find(member => member.id === id));
  const memberChildren = useSelector(state => state.membersList
    .filter(member => member.parent === memberInfo.name)
    .sort(sortingRule));

  const highlightedMember = useSelector(state => state.highlightedMember);

  const toggleAreChildrenCollapsed = () => setAreChildrenCollapsed(!areChildrenCollapsed);

  // приховати дітей, якщо мембер сам прихований
  useEffect(() => {
    if (isCollapsed) setAreChildrenCollapsed(true);
  }, [isCollapsed]);

  // відобразити дітей, якщо один з нащадків виділений
  useEffect(() => {
    if (highlightedMember.ancestorsIds.includes(id)) {
      setAreChildrenCollapsed(false);
    }
  }, [id, highlightedMember]);

  return (
    <div
      id={id}
      className={classnames('member', {
        'member_has-parent': memberInfo.parent,
        'member_collapsed': isCollapsed,
      })}
    >
      <MemberInfo
        {...memberInfo}
        highlighted={highlightedMember.id === id}
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
            {memberChildren.map(child => (
              <Member key={child.id} id={child.id} isCollapsed={isCollapsed || areChildrenCollapsed} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Member;
