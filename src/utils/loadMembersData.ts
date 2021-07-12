import { MemberInfoType } from 'config/memberType';

import membersSheet from 'config/sheets';

import parseMembersSheetRow from './parseMembersSheetRow';
import { findStringInArray } from './arrayUtils';

const initGoogleApi = (apiKey: string) => window.gapi.client.init({
  apiKey,
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
});

const loadDataFromSpreadsheet = (spreadsheetId: string, sheetName: string): Promise<Array<Array<any>> | undefined> => (
  new Promise((resolve, reject) => {
    window.gapi.client.load('sheets', 'v4', () => {
      window.gapi.client.sheets.spreadsheets.values
        .get({ spreadsheetId, range: `${sheetName}!A1:BG1000` })
        .then((response) => resolve(response.result.values))
        .catch((response) => reject(response.result.error));
    });
  })
);

const findCellSpanInRow = (row: Array<string>, cellValue: string): [number, number] => {
  let span = 0;
  const firstColumnId = findStringInArray(row, cellValue);
  if (firstColumnId) {
    span += 1;
    let currentColumn = firstColumnId;
    while (!row[currentColumn + 1]) {
      span += 1;
      currentColumn += 1;
    }
  }
  return [firstColumnId, span];
};

const loadMembersData = (apiKey: string, spreadsheetId:string):
  Promise<{ membersList: MemberInfoType[], warnings: Array<string> }> => (
  new Promise((resolve, reject) => {
    window.gapi.load('client', async () => {
      try {
        await initGoogleApi(apiKey);
      } catch (e) {
        reject({ type: 'gapiKeyError' });
      }

      try {
        const membersSpreadsheet = await loadDataFromSpreadsheet(spreadsheetId, membersSheet.name);

        if (membersSpreadsheet && membersSpreadsheet.length) {
          const warnings = [];

          const firstRow = membersSpreadsheet[0];
          await membersSpreadsheet.shift();

          const headings = membersSpreadsheet[0];
          await membersSpreadsheet.shift();

          const projects: Array<string> = [];
          const [projectsFirstColumnId, projectsAmount] = findCellSpanInRow(firstRow, membersSheet.columns.projects);

          if (projectsFirstColumnId > -1 && projectsAmount) {
            for (let i = projectsFirstColumnId; i < projectsFirstColumnId + projectsAmount; i++) {
              projects.push(headings[i].split(' (')[0]);
            }
          } else {
            warnings.push('projectsColumnMissing');
          }

          const departments: Array<string> = [];
          const [depsFirstColumnId, depsAmount] = findCellSpanInRow(firstRow, membersSheet.columns.departments);

          if (depsFirstColumnId > -1 && depsAmount) {
            for (let i = depsFirstColumnId; i < depsFirstColumnId + depsAmount; i++) {
              departments.push(headings[i].split(' (')[0]);
            }
          } else {
            warnings.push('depsColumnMissing');
          }

          const nameColumnId = findStringInArray(headings, membersSheet.columns.name);
          const statusColumnId = findStringInArray(headings, membersSheet.columns.status);
          const parentColumnId = findStringInArray(headings, membersSheet.columns.parent);

          const activeColumnId = findStringInArray(headings, membersSheet.columns.active);
          if (activeColumnId < 0) warnings.push('activeColumnMissing');
          const pictureColumnId = findStringInArray(headings, membersSheet.columns.picture);
          if (pictureColumnId < 0) warnings.push('pictureColumnMissing');
          const birthdayColumnId = findStringInArray(headings, membersSheet.columns.birthday);
          if (birthdayColumnId < 0) warnings.push('birthdayColumnMissing');
          const recDateColumnId = findStringInArray(headings, membersSheet.columns.recDate);
          if (recDateColumnId < 0) warnings.push('recDateColumnMissing');
          const facultyColumnId = findStringInArray(headings, membersSheet.columns.faculty);
          if (facultyColumnId < 0) warnings.push('facultyColumnMissing');
          const familyColumnId = findStringInArray(headings, membersSheet.columns.family);
          if (familyColumnId < 0) warnings.push('familyColumnMissing');
          const telegramColumnId = findStringInArray(headings, membersSheet.columns.telegram);
          if (telegramColumnId < 0) warnings.push('telegramColumnMissing');
          const emailColumnId = findStringInArray(headings, membersSheet.columns.email);
          if (emailColumnId < 0) warnings.push('emailColumnMissing');
          const phoneColumnId = findStringInArray(headings, membersSheet.columns.phone);
          if (phoneColumnId < 0) warnings.push('phoneColumnMissing');
          const historyColumnId = findStringInArray(headings, membersSheet.columns.history);
          if (historyColumnId < 0) warnings.push('historyColumnMissing');
          const boardColumnId = findStringInArray(headings, membersSheet.columns.board);
          if (boardColumnId < 0) warnings.push('boardColumnMissing');
          const internationalDepsColumnId = findStringInArray(headings, membersSheet.columns.internationalDeps);
          if (internationalDepsColumnId < 0) warnings.push('internationalDepsColumnMissing');
          const internationalEventsColumnId = findStringInArray(headings, membersSheet.columns.internationalEvents);
          if (internationalEventsColumnId < 0) warnings.push('internationalEventsColumnMissing');

          if (nameColumnId > -1 && statusColumnId > -1 && parentColumnId > -1) {
            const columnIds = {
              name: nameColumnId,
              status: statusColumnId,
              active: activeColumnId,
              picture: pictureColumnId,
              parent: parentColumnId,
              birthday: birthdayColumnId,
              recDate: recDateColumnId,
              faculty: facultyColumnId,
              family: familyColumnId,
              telegram: telegramColumnId,
              email: emailColumnId,
              phone: phoneColumnId,
              history: historyColumnId,
              board: boardColumnId,
              projectsFirst: projectsFirstColumnId,
              depsFirst: depsFirstColumnId,
              internationalDeps: internationalDepsColumnId,
              internationalEvents: internationalEventsColumnId,
            };

            const membersList = membersSpreadsheet
              .filter((row) => row[nameColumnId] && row[statusColumnId])
              .map((row, rowId) => parseMembersSheetRow(row, rowId, columnIds, projects, departments));

            resolve({ membersList, warnings });
          }
          const errorColumns = [];
          if (nameColumnId === -1) errorColumns.push(membersSheet.columns.name);
          if (statusColumnId === -1) errorColumns.push(membersSheet.columns.status);
          if (parentColumnId === -1) errorColumns.push(membersSheet.columns.parent);
          reject({ type: 'columnsError', details: errorColumns.join(', ') });
        }
        reject({ type: 'emptySheetError' });
      } catch (error) {
        if (error.status === 'NOT_FOUND') reject({ type: 'spreadsheetIDError' });
        if (error.status === 'INVALID_ARGUMENT') reject({ type: 'sheetNameError' });
      }
    });
  })
);

export default loadMembersData;
