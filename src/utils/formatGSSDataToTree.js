import statuses from 'config/statuses';

const statusesOrder = Object.values(statuses);
const sortingRules = (child1, child2) => {
  if (child1.recDate && child2.recDate)
    if (child1.recDate.getTime() !== child2.recDate.getTime())
      return child1.recDate > child2.recDate ? 1 : -1;

  const child1StatusIndex = statusesOrder.indexOf(child1.status);
  const child2StatusIndex = statusesOrder.indexOf(child2.status);
  if (child1StatusIndex !== child2StatusIndex)
    return child1StatusIndex < child2StatusIndex ? 1 : -1;

  return child1.name > child2.name ? 1 : -1;
};

const findChildren = (memberData, rawData) => {
  const formattedData = {...memberData};

  const children = rawData.filter(member => member.parent === memberData.name);
  if (children.length > 0) {
    formattedData.children = children
      .map(child => findChildren(child, rawData))
      .sort(sortingRules);
  }

  return formattedData;
};

const formatGSSDataToTree = rawData => {
  const firstGeneration = rawData.filter(member => !member.parent);
  return firstGeneration
    .map(member => findChildren(member, rawData))
    .sort(sortingRules);
}

export default formatGSSDataToTree;
