import {MemberIdType, MemberInfoType} from 'config/memberType';

const getMemberAncestorsIds = (membersList: Array<MemberInfoType>, memberId: MemberIdType) => {
  const ancestorsIds = [];
  let currentMember = membersList.find(member => member.id === memberId);

  if (currentMember) {
    while (currentMember.parent) {
      const parentName: string = currentMember.parent;
      currentMember = membersList.find(member => member.name === parentName);
      if (!currentMember) break;
      ancestorsIds.push(currentMember.id);
    }
  }

  return ancestorsIds;
};

export default getMemberAncestorsIds;
