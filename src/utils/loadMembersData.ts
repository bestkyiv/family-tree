import parseMembersSheetRow from './parseMembersSheetRow';
import {findStringInArray} from './arrayUtils';

import {MemberInfoType} from 'config/memberType';

const MEMBERS_SHEET_NAME = 'Members';

const initGoogleApi = (apiKey: string) =>
  window.gapi.client.init({apiKey, discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']});

const loadDataFromSpreadsheet = (spreadsheetId: string, sheetName: string): Promise<Array<Array<any>> | undefined> => (
  new Promise((resolve, reject) => {
    window.gapi.client.load('sheets', 'v4', () => {
      window.gapi.client.sheets.spreadsheets.values
        .get({spreadsheetId, range: `${sheetName}!A1:BG1000`})
        .then(response => resolve(response.result.values))
        .catch(response => reject(response.result.error));
    });
  })
);

const findCellSpanInRow = (row: Array<string>, cellValue: string): [number, number] => {
  let span = 0;
  const firstColumn = findStringInArray(row, cellValue);
  if (firstColumn) {
    span++;
    let currentColumn = firstColumn;
    while (!row[currentColumn + 1]) {
      span++;
      currentColumn++;
    }
  }
  return [firstColumn, span];
};

const loadMembersData = (apiKey: string, spreadsheetId:string): Promise<MemberInfoType[]> => (
  new Promise((resolve, reject) => {
    window.gapi.load('client', async () => {
      try {
        await initGoogleApi(apiKey);
      } catch(e) {
        reject('gapiKeyError');
      }
      
      try {
        const membersSpreadsheet = await loadDataFromSpreadsheet(spreadsheetId, MEMBERS_SHEET_NAME);
  
        if (membersSpreadsheet && membersSpreadsheet.length) {
          const firstRow = membersSpreadsheet[0];
          await membersSpreadsheet.shift();
  
          const headings = membersSpreadsheet[0];
          await membersSpreadsheet.shift();
  
          const projects: Array<string> = [];
          const [projectsFirstColumn, projectsAmount] = findCellSpanInRow(firstRow, 'Проекти');
  
          if (projectsFirstColumn && projectsAmount) {
            for (let i = projectsFirstColumn; i < projectsFirstColumn + projectsAmount; i++) {
              projects.push(headings[i].split(' (')[0]);
            }
          }
  
          const departments: Array<string> = [];
          const [depsFirstColumn, depsAmount] = findCellSpanInRow(firstRow, 'Департаменти');
  
          if (depsFirstColumn && depsAmount) {
            for (let i = depsFirstColumn; i < depsFirstColumn + depsAmount; i++) {
              departments.push(headings[i].split(' (')[0]);
            }
          }
          
          const nameColumnId = findStringInArray(headings, 'ПІБ');
          const statusColumnId = findStringInArray(headings, 'Статус');
          
          if (nameColumnId > -1 && statusColumnId > -1) {
            const columnIds = {
              name: nameColumnId,
              status: statusColumnId,
              picture: findStringInArray(headings, 'Фотографія'),
              parent: findStringInArray(headings, 'Ментор'),
              birthday: findStringInArray(headings, 'День народження'),
              recDate: findStringInArray(headings, 'Рекрутмент'),
              faculty: findStringInArray(headings, 'Факультет'),
              family: findStringInArray(headings, 'Сім\'я'),
              telegram: findStringInArray(headings, 'Telegram'),
              email: findStringInArray(headings, 'Email'),
              phone: findStringInArray(headings, 'Телефон'),
              history: findStringInArray(headings, 'Історія'),
              board: findStringInArray(headings, 'Board'),
              projectsFirstColumn,
              depsFirstColumn,
              internationalDeps: findStringInArray(headings, 'Міжнар депи і проекти'),
              internationalEvents: findStringInArray(headings, 'Міжнар івенти'),
            };
  
            const membersList = membersSpreadsheet
              .filter(row => row[nameColumnId] && row[statusColumnId])
              .map((row, rowId) => parseMembersSheetRow(row, rowId, columnIds, projects, departments));
  
            resolve(membersList);
          }
          if (nameColumnId < 0 && statusColumnId > -1) reject('nameColumnError');
          if (nameColumnId < 0 && statusColumnId < 0) reject('nameAndStatusColumnsError');
          reject('statusColumnError');
        }
        reject('emptySheetError');
      } catch(error) {
        if (error.status === 'NOT_FOUND') reject('spreadsheetIDError');
        if (error.status === 'INVALID_ARGUMENT') reject('sheetNameError');
      }
    });
  })
);

export default loadMembersData;
