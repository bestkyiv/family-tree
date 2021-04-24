const indexOfItemWhichStartsWith = (array, string) => {
  const regexp = new RegExp(`^${string}.*`, 'i');
  const item = array.find(item => regexp.test(item.toLowerCase()));
  return array.indexOf(item);
}

export default indexOfItemWhichStartsWith;
