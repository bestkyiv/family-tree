export const findStringInArray = (array: Array<string>, string: string): number => {
  const regexp = new RegExp(`^${string}.*`, 'i');
  const foundItem = array.find((item) => regexp.test(item.toLowerCase()));
  return foundItem ? array.indexOf(foundItem) : -1;
};

export const getRandomItemsFromArray = (arr: Array<any>, amount: number) => arr
  .sort(() => 0.5 - Math.random())
  .slice(0, amount);
