export const findStringInArray = (array, string) => {
  const regexp = new RegExp(`^${string}.*`, 'i');
  const item = array.find(item => regexp.test(item.toLowerCase()));
  return array.indexOf(item);
}

export const getRandomItemsFromArray = (arr, amount) => {
  const result = new Array(amount),
    taken = new Array(arr.length);
  let len = arr.length;

  if (amount > len) return arr;

  while (amount--) {
    const x = Math.floor(Math.random() * len);
    result[amount] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }

  return result;
}
