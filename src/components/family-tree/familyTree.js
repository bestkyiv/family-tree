import React  from 'react';
import {useSelector} from 'react-redux';

import sortingRule from 'utils/sortMembersRule';

import Loader from 'components/loader/loader';

import Canvas from './canvas/canvas';
import Member from './member/member';

import './familyTree.scss';


const FamilyTree = () => {
  const firstGeneration = useSelector(state => state.membersList
    .filter(member => member.parent == null)
    .sort(sortingRule));

  return !firstGeneration.length ? <Loader /> : (
    <Canvas>
      <div className="members-container">
        {firstGeneration.map(member => (
          <Member key={member.id} id={member.id} />
        ))}
      </div>
    </Canvas>
  );
}

export default FamilyTree;
