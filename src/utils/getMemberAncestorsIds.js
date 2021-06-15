const getMemberAncestorsIds = (membersList, memberId) => {
  const ancestorsIds = [];
  let currentMember = membersList.find(member => member.id === memberId);

  if (currentMember) {
    while (currentMember.parent) {
      const parentName = currentMember.parent;
      currentMember = membersList.find(member => member.name === parentName);
      ancestorsIds.push(currentMember.id);
    }
  }

  return ancestorsIds;
};

export default getMemberAncestorsIds;
