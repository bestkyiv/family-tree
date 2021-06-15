import statuses from 'config/statuses';

const statusesOrder = Object.values(statuses);
const sortingRule = (child1, child2) => {
  if (child1.details.recDate.isValid() && child2.details.recDate.isValid())
    if (child1.details.recDate.diff(child2.details.recDate) !== 0)
      return child1.details.recDate.diff(child2.details.recDate);

  const child1StatusIndex = statusesOrder.indexOf(child1.status);
  const child2StatusIndex = statusesOrder.indexOf(child2.status);
  if (child1StatusIndex !== child2StatusIndex)
    return child1StatusIndex < child2StatusIndex ? 1 : -1;

  return child1.name > child2.name ? 1 : -1;
};

export default sortingRule;
