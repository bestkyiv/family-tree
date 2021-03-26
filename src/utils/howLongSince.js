const addLabelToYears = years => {
  if (years > 4 && years < 21)
    return years + ' років';

  let result = years;
  switch (years % 10) {
    case 1: result += ' рік'; break;
    case 2: case 3: case 4: result += ' роки'; break;
    default: result += ' років';
  }

  return result;
}

const addLabelToMonths = months => {
  switch (months) {
    case 1: return months + ' місяць';
    case 2: case 3: case 4: return months + ' місяці';
    default: return months + ' місяців';
  }
}

const addLabelToDays = days => {
  if (days > 4 && days < 21)
    return days + ' днів';

  let result = days;
  switch (days % 10) {
    case 1: result += ' день'; break;
    case 2: case 3: case 4: result += ' дні'; break;
    default: result += ' днів';
  }

  return result;
}

const howLongSince = date => {
  const now = Date.now();
  const ageDate = new Date(now - date.getTime());
  const years = Math.abs(ageDate.getUTCFullYear() - 1970);
  const months = ageDate.getMonth();
  const days = ageDate.getDate();

  return {
    years: years ? addLabelToYears(years) : null,
    months: months ? addLabelToMonths(months) : null,
    days: days ? addLabelToDays(days) : null,
  };
}

export default howLongSince;
