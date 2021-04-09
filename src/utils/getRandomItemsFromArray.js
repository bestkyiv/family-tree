const getRandomItemsFromArray = (arr, amount) => {
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

export default getRandomItemsFromArray;
