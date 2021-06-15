const defaultState = {
  membersList: [],
  highlightedMember: {
    id: null,
    ancestorsIds: [],
  },
};

const SET_MEMBERS_LIST = 'SET_MEMBERS_LIST';
const SET_HIGHLIGHTED_MEMBER = 'SET_HIGHLIGHTED_MEMBER';
const RESET_HIGHLIGHTED_MEMBER = 'RESET_HIGHLIGHTED_MEMBER';

export const reducer = (state = defaultState, action) => {
  switch(action.type) {
    case SET_MEMBERS_LIST:
      return {
        ...state,
        membersList: action.payload,
      };
    case SET_HIGHLIGHTED_MEMBER:
      return {
        ...state,
        highlightedMember: {...action.payload},
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

export const setMembersListAction = (payload) => ({type: SET_MEMBERS_LIST, payload});
export const setHighlightedMemberAction = (payload) => ({type: SET_HIGHLIGHTED_MEMBER, payload});
export const resetHighlightedMemberAction = () => ({type: RESET_HIGHLIGHTED_MEMBER});
