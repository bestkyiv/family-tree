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

const parseMembersSheetRow = (row, rowId) => ({
  id: 'member' + (rowId + 1),
  name: row[membersSheet.columnsOrder.indexOf('name')],
  status: row[membersSheet.columnsOrder.indexOf('status')],
  picture: formatPictureSrc(row[membersSheet.columnsOrder.indexOf('picture')]),
  active: row[membersSheet.columnsOrder.indexOf('active')] === "TRUE",
  birthday: parseDate(row[membersSheet.columnsOrder.indexOf('birthday')]),
  recDate: parseDate(row[membersSheet.columnsOrder.indexOf('recDate')]),
  parent: row[membersSheet.columnsOrder.indexOf('parent')],
  family: row[membersSheet.columnsOrder.indexOf('family')],
});

export default parseMembersSheetRow;
