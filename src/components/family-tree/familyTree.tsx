import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {resetHighlightedMemberAction, useFirstGeneration} from 'store/reducer';

import Loader from 'components/shared/loader/loader';

import Member from './member/member';

import './familyTree.scss';

const FamilyTree = () => {
  const firstGeneration = useFirstGeneration();
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    document.addEventListener('click', () => dispatch(resetHighlightedMemberAction()));
    document.addEventListener('touchstart', () => dispatch(resetHighlightedMemberAction()));
  }, [dispatch]);

  return !firstGeneration.length ? <Loader /> : (
    <div className="members-container">
      {firstGeneration.map(memberInfo => <Member key={memberInfo.id} info={memberInfo} />)}
    </div>
  );
}

export default FamilyTree;
