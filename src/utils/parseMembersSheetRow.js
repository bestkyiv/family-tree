import {findStringInArray} from './arrayUtils';
import moment from 'moment';
import 'moment/locale/uk';

const formatPictureSrc = link => {
  const imageGoogleDriveId = /[-\w]{25,}/.exec(link);
  return imageGoogleDriveId
    ? `https://drive.google.com/uc?id=${imageGoogleDriveId}&export=download`
    : null;
}

const parseMembersSheetRow = (row, rowId, headings, existingProjects, existingDeps) => {
  const projects = existingProjects.map(project => {
    const position = row[findStringInArray(headings, project)];
    if (position && !position.includes('Подача')) {
      return {name: project, position};
    }
    return null;
  }).filter(project => project != null);

  const departments = existingDeps.map(dep => {
    const position = row[findStringInArray(headings, dep)];
    if (position) {
      return position !== 'Member' ? [dep, position] : dep;
    }
    return null;
  }).filter(dep => dep != null);

  const internationalDeps = row[findStringInArray(headings, 'Міжнар депи і проекти')]
      .split('\n').filter(item => !!item)
      .map(dep => {
        const addition = /\(.+\)/g.exec(dep);
        return addition ? [dep.split(' (')[0], addition[0].slice(1,-1)] : dep;
      });

  const internationalEvents = row[findStringInArray(headings, 'Міжнар івенти')]
      .split('\n').filter(item => !!item)
      .map(event => {
        const addition = /\(.+\)/g.exec(event);
        return addition ? [event.split(' (')[0], addition[0].slice(1,-1)] : event;
      });

  return {
    id: 'member' + (rowId + 1),
    name: row[findStringInArray(headings, 'ПІБ')],
    status: row[findStringInArray(headings, 'Статус')],
    picture: formatPictureSrc(row[findStringInArray(headings, 'Фотографія')]),
    parent: row[findStringInArray(headings, 'Ментор')] || null,
    activity: {
      locally: row[findStringInArray(headings, 'Активний')] === "TRUE",
      internationally: internationalDeps.length > 0
    },
    details: {
      birthday: moment(row[findStringInArray(headings, 'День народження')], 'DD.MM.YYYY'),
      recDate: moment(row[findStringInArray(headings, 'Рекрутмент')], 'DD.MM.YYYY'),
      faculty: row[findStringInArray(headings, 'Факультет')],
      family: row[findStringInArray(headings, 'Сім\'я')],
      contacts: {
        email: row[findStringInArray(headings, 'Email')],
        telegram: row[findStringInArray(headings, 'Telegram')],
        phone: row[findStringInArray(headings, 'Телефон')],
      },
      membership: {
        board: row[findStringInArray(headings, 'Board')],
        projects,
        departments,
        internationalDeps,
        internationalEvents,
      },
    },
    history: row[findStringInArray(headings, 'Історія')].split('\n').filter(item => !!item),
  };
};

export default parseMembersSheetRow;
