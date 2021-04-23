import indexOfItemWhichContains from './indexOfItemWhichContains';

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
    const position = row[indexOfItemWhichContains(headings, project)];
    if (position && !position.includes('Подача')) {
      return {name: project, position};
    }
    return null;
  }).filter(project => project != null);

  const departments = existingDeps.map(dep => {
    const position = row[indexOfItemWhichContains(headings, dep)];
    if (position) {
      return position !== 'Member' ? [dep, position] : dep;
    }
    return null;
  }).filter(dep => dep != null);

  return {
    id: 'member' + (rowId + 1),
    name: row[indexOfItemWhichContains(headings, 'ПІБ')],
    status: row[indexOfItemWhichContains(headings, 'Статус')],
    picture: formatPictureSrc(row[indexOfItemWhichContains(headings, 'Фотографія')]),
    parent: row[indexOfItemWhichContains(headings, 'Ментор')],
    activity: {
      locally: row[indexOfItemWhichContains(headings, 'Активний')] === "TRUE",
      internationally: !!row[indexOfItemWhichContains(headings, 'Міжнар депи')],
    },
    details: {
      birthday: parseDate(row[indexOfItemWhichContains(headings, 'День народження')]),
      recDate: parseDate(row[indexOfItemWhichContains(headings, 'Рекрутмент')]),
      faculty: row[indexOfItemWhichContains(headings, 'Факультет')],
      family: row[indexOfItemWhichContains(headings, 'Сім\'я')],
      contacts: {
        email: row[indexOfItemWhichContains(headings, 'Email')],
        telegram: row[indexOfItemWhichContains(headings, 'Telegram')],
        phone: row[indexOfItemWhichContains(headings, 'Телефон')],
      },
      membership: {
        board: row[indexOfItemWhichContains(headings, 'Board')],
        projects,
        departments,
      }
    }
  };
};

export default parseMembersSheetRow;
