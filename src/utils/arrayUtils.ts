export const findStringInArray = (array: Array<string>, string: string): number => {
  const regexp = new RegExp(`^${string}.*`, 'i');
  const foundItem = array.find((item) => regexp.test(item.toLowerCase()));
  return foundItem ? array.indexOf(foundItem) : -1;
};

export const getRandomItemsFromArray = (arr: Array<any>, amount: number) => {
  const result = new Array(amount);
  const taken = new Array(arr.length);
  let len = arr.length;

  if (amount > len) return arr;

  let itemsLeft = amount;
  while (itemsLeft) {
    len -= 1;
    const x = Math.floor(Math.random() * len);
    result[amount] = arr[x in taken ? taken[x] : x];
    taken[x] = len in taken ? taken[len] : len;
    itemsLeft -= 1;
  }

  return result;
};
