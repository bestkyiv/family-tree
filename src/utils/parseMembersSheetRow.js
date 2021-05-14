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

  const internationalDeps = row[indexOfItemWhichStartsWith(headings, 'Міжнар депи і проекти')]
      .split('\n').filter(item => !!item)
      .map(dep => {
        const addition = /\(.+\)/g.exec(dep);
        return addition ? [dep.split(' (')[0], addition[0].slice(1,-1)] : dep;
      });

  const internationalEvents = row[indexOfItemWhichStartsWith(headings, 'Міжнар івенти')]
      .split('\n').filter(item => !!item)
      .map(event => {
        const addition = /\(.+\)/g.exec(event);
        return addition ? [event.split(' (')[0], addition[0].slice(1,-1)] : event;
      });

  return {
    id: 'member' + (rowId + 1),
    name: row[indexOfItemWhichStartsWith(headings, 'ПІБ')],
    status: row[indexOfItemWhichStartsWith(headings, 'Статус')],
    picture: formatPictureSrc(row[indexOfItemWhichStartsWith(headings, 'Фотографія')]),
    parent: row[indexOfItemWhichStartsWith(headings, 'Ментор')],
    activity: {
      locally: row[indexOfItemWhichStartsWith(headings, 'Активний')] === "TRUE",
      internationally: internationalDeps.length > 0
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
        internationalDeps,
        internationalEvents,
      },
    },
    history: row[indexOfItemWhichStartsWith(headings, 'Історія')].split('\n').filter(item => !!item),
  };
};

export default parseMembersSheetRow;
