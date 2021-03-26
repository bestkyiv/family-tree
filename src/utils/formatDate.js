const formatDate = date => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  let formattedDate = '';
  if (day < 10) formattedDate = '0';
  formattedDate += day + '.';
  if (month < 10) formattedDate += '0';
  formattedDate += month + '.' + year;

  return formattedDate;
}

export default formatDate;
