import {MemberInfoType} from 'config/memberType';

const statusesOrder = ['Observer', 'Baby', 'Guest', 'Full', 'Alumni'];

const sortingRule = (child1: MemberInfoType, child2: MemberInfoType) => {
  if (child1.details?.recDate && child2.details?.recDate)
    if (child1.details.recDate.diff(child2.details.recDate) !== 0)
      return child1.details.recDate.diff(child2.details.recDate);

  const child1StatusIndex = statusesOrder.indexOf(child1.status);
  const child2StatusIndex = statusesOrder.indexOf(child2.status);
  if (child1StatusIndex !== child2StatusIndex)
    return child1StatusIndex < child2StatusIndex ? 1 : -1;

  return child1.name > child2.name ? 1 : -1;
};

export default sortingRule;
