import indexOfItemWhichStartsWith from './indexOfItemWhichStartsWith';

const parseDate = date => {
  if (!date) return null;
  const splitDate = date.split('.');
  return new Date(+splitDate[2], +splitDate[1] - 1, +splitDate[0]);
}

const formatPictureSrc = link => {
  const imageGoogleDriveId = /[-\w]{25,}/.exec(link);
  return imageGoogleDriveId
    ? `https://drive.google.com/uc?id=${imageGoogleDriveId}&export=download`
    : null;
}

const parseMembersSheetRow = (row, rowId, headings, existingProjects, existingDeps) => {
  const projects = existingProjects.map(project => {
    const position = row[indexOfItemWhichStartsWith(headings, project)];
    if (position && !position.includes('Подача')) {
      return {name: project, position};
    }
    return null;
  }).filter(project => project != null);

  const departments = existingDeps.map(dep => {
    const position = row[indexOfItemWhichStartsWith(headings, dep)];
    if (position) {
      return position !== 'Member' ? [dep, position] : dep;
    }
    return null;
  }).filter(dep => dep != null);

  return {
    id: 'member' + (rowId + 1),
    name: row[indexOfItemWhichStartsWith(headings, 'ПІБ')],
    status: row[indexOfItemWhichStartsWith(headings, 'Статус')],
    picture: formatPictureSrc(row[indexOfItemWhichStartsWith(headings, 'Фотографія')]),
    parent: row[indexOfItemWhichStartsWith(headings, 'Ментор')],
    activity: {
      locally: row[indexOfItemWhichStartsWith(headings, 'Активний')] === "TRUE",
      internationally: !!row[indexOfItemWhichStartsWith(headings, 'Міжнар депи')],
    },
    details: {
      birthday: parseDate(row[indexOfItemWhichStartsWith(headings, 'День народження')]),
      recDate: parseDate(row[indexOfItemWhichStartsWith(headings, 'Рекрутмент')]),
      faculty: row[indexOfItemWhichStartsWith(headings, 'Факультет')],
      family: row[indexOfItemWhichStartsWith(headings, 'Сім\'я')],
      contacts: {
        email: row[indexOfItemWhichStartsWith(headings, 'Email')],
        telegram: row[indexOfItemWhichStartsWith(headings, 'Telegram')],
        phone: row[indexOfItemWhichStartsWith(headings, 'Телефон')],
      },
      membership: {
        board: row[indexOfItemWhichStartsWith(headings, 'Board')],
        projects,
        departments,
      },
    },
    history: row[indexOfItemWhichStartsWith(headings, 'Історія')].split('\n').filter(item => !!item),
  };
};

export default parseMembersSheetRow;
