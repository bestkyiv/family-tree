import {membersSheet} from 'config/sheets';

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

const parseMembersSheetRow = (row, rowId, existingProjects, existingDepartments) => {
  const projects = existingProjects.map((project, projectId) => {
    const position = row[membersSheet.columnsOrder.length + projectId];
    if (position && !position.includes('Подача')) {
      return {name: project, position};
    }
    return null;
  }).filter(project => project != null);

  const departments = existingDepartments.map((dep, depId) => {
    const position = row[membersSheet.columnsOrder.length + existingProjects.length + depId];
    if (position) {
      return position !== 'Member' ? [dep, position] : dep;
    }
    return null;
  }).filter(dep => dep != null);

  return {
    id: 'member' + (rowId + 1),
    name: row[membersSheet.columnsOrder.indexOf('name')],
    status: row[membersSheet.columnsOrder.indexOf('status')],
    picture: formatPictureSrc(row[membersSheet.columnsOrder.indexOf('picture')]),
    active: row[membersSheet.columnsOrder.indexOf('active')] === "TRUE",
    parent: row[membersSheet.columnsOrder.indexOf('parent')],
    details: {
      birthday: parseDate(row[membersSheet.columnsOrder.indexOf('birthday')]),
      recDate: parseDate(row[membersSheet.columnsOrder.indexOf('recDate')]),
      faculty: row[membersSheet.columnsOrder.indexOf('faculty')],
      family: row[membersSheet.columnsOrder.indexOf('family')],
      contacts: {
        email: row[membersSheet.columnsOrder.indexOf('email')],
        telegram: row[membersSheet.columnsOrder.indexOf('telegram')],
        phone: row[membersSheet.columnsOrder.indexOf('phone')],
      },
      membership: {
        board: row[membersSheet.columnsOrder.indexOf('board')],
        projects,
        departments,
      }
    }
  };
};

export default parseMembersSheetRow;
