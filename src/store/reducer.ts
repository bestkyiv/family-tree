import { useSelector } from 'react-redux';
import moment from 'moment';

import getMemberAncestorsIds from 'utils/getMemberAncestorsIds';
import sortingRule from 'utils/sortMembersRule';

import { MemberInfoType, MemberIdType } from 'config/memberType';

type State = {
  membersList: Array<MemberInfoType>,
  highlightedMember: {
    id: MemberIdType | null,
    ancestorsIds: Array<MemberIdType>,
  },
};

const defaultState: State = {
  membersList: [],
  highlightedMember: {
    id: null,
    ancestorsIds: [],
  },
};

const SET_MEMBERS_LIST = 'SET_MEMBERS_LIST';
const SET_HIGHLIGHTED_MEMBER = 'SET_HIGHLIGHTED_MEMBER';
const RESET_HIGHLIGHTED_MEMBER = 'RESET_HIGHLIGHTED_MEMBER';

type ActionType = {
  type: 'SET_MEMBERS_LIST' | 'SET_HIGHLIGHTED_MEMBER' | 'RESET_HIGHLIGHTED_MEMBER',
  payload: any,
}

export const reducer = (state = defaultState, action: ActionType) => {
  switch (action.type) {
    case SET_MEMBERS_LIST:
      return {
        ...state,
        membersList: action.payload,
      };
    case SET_HIGHLIGHTED_MEMBER:
      return {
        ...state,
        highlightedMember: {
          id: action.payload,
          ancestorsIds: getMemberAncestorsIds(state.membersList, action.payload),
        },
      };
    case RESET_HIGHLIGHTED_MEMBER:
      return {
        ...state,
        highlightedMember: defaultState.highlightedMember,
      };
    default:
      return state;
  }
};

export const setMembersListAction = (payload: Array<MemberInfoType>) => ({ type: SET_MEMBERS_LIST, payload });
export const setHighlightedMemberAction = (payload: MemberIdType) => ({ type: SET_HIGHLIGHTED_MEMBER, payload });
export const resetHighlightedMemberAction = () => ({ type: RESET_HIGHLIGHTED_MEMBER });

export const useMembersList = () => useSelector((state: State) => state.membersList);
export const useFirstGeneration = () => useMembersList()
  .filter((member) => !member.parent)
  .sort(sortingRule);
export const useMemberChildren = (name: string) => useMembersList()
  .filter((member: MemberInfoType) => member.parent === name)
  .sort(sortingRule);
export const useHighlightedMember = () => useSelector((state: State) => state.highlightedMember);

const today = moment();
export const useBirthdayMembers = () => useMembersList()
  .filter((member) => member.details?.birthday?.date() === today.date()
    && member.details.birthday.month() === today.month())
  .sort((member1, member2) => {
    if ((member1.activity?.locally || member1.activity?.internationally)
      && (member2.activity?.locally || member2.activity?.internationally)) {
      if (member1.details?.recDate && member2.details?.recDate) {
        return member2.details.recDate.diff(member1.details.recDate);
      }

      return member1.name > member2.name ? 1 : -1;
    }

    if (member1.activity?.locally && !member2.activity?.locally) return -1;
    if (member1.activity?.internationally
      && !member2.activity?.locally
      && !member2.activity?.internationally) return -1;

    return 0;
  });
