import parseMembersSheetRow from './parseMembersSheetRow';
import {findStringInArray} from './arrayUtils';

import {MemberInfoType} from 'config/memberType';

const MEMBERS_SHEET_NAME = 'Members';
const MEMBERS_SHEET_COLUMNS = {
  name: 'ПІБ',
  status: 'Статус',
  parent: 'Ментор',
  active: 'Активний',
  picture: 'Фотографія',
  birthday: 'День народження',
  recDate:  'Рекрутмент',
  faculty: 'Факультет',
  family: 'Сім\'я',
  telegram: 'Telegram',
  email: 'Email',
  phone: 'Телефон',
  history: 'Історія',
  board: 'Board',
  projects: 'Проекти',
  departments: 'Департаменти',
  internationalDeps: 'Міжнар депи і проекти',
  internationalEvents: 'Міжнар івенти',
};

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
        reject({type: 'gapiKeyError'});
      }
      
      try {
        const membersSpreadsheet = await loadDataFromSpreadsheet(spreadsheetId, MEMBERS_SHEET_NAME);
  
        if (membersSpreadsheet && membersSpreadsheet.length) {
          const firstRow = membersSpreadsheet[0];
          await membersSpreadsheet.shift();
  
          const headings = membersSpreadsheet[0];
          await membersSpreadsheet.shift();
  
          const projects: Array<string> = [];
          const [projectsFirstColumn, projectsAmount] = findCellSpanInRow(firstRow, MEMBERS_SHEET_COLUMNS.projects);
  
          if (projectsFirstColumn && projectsAmount) {
            for (let i = projectsFirstColumn; i < projectsFirstColumn + projectsAmount; i++) {
              projects.push(headings[i].split(' (')[0]);
            }
          }
  
          const departments: Array<string> = [];
          const [depsFirstColumn, depsAmount] = findCellSpanInRow(firstRow, MEMBERS_SHEET_COLUMNS.departments);
  
          if (depsFirstColumn && depsAmount) {
            for (let i = depsFirstColumn; i < depsFirstColumn + depsAmount; i++) {
              departments.push(headings[i].split(' (')[0]);
            }
          }
          
          const nameColumnId = findStringInArray(headings, MEMBERS_SHEET_COLUMNS.name);
          const statusColumnId = findStringInArray(headings, MEMBERS_SHEET_COLUMNS.status);
          const parentColumnId = findStringInArray(headings, MEMBERS_SHEET_COLUMNS.parent);
          
          if (nameColumnId > -1 && statusColumnId > -1 && parentColumnId > -1) {
            const columnIds = {
              name: nameColumnId,
              status: statusColumnId,
              active: findStringInArray(headings, MEMBERS_SHEET_COLUMNS.active),
              picture: findStringInArray(headings, MEMBERS_SHEET_COLUMNS.picture),
              parent: parentColumnId,
              birthday: findStringInArray(headings, MEMBERS_SHEET_COLUMNS.birthday),
              recDate: findStringInArray(headings, MEMBERS_SHEET_COLUMNS.recDate),
              faculty: findStringInArray(headings, MEMBERS_SHEET_COLUMNS.faculty),
              family: findStringInArray(headings, MEMBERS_SHEET_COLUMNS.family),
              telegram: findStringInArray(headings, MEMBERS_SHEET_COLUMNS.telegram),
              email: findStringInArray(headings, MEMBERS_SHEET_COLUMNS.email),
              phone: findStringInArray(headings, MEMBERS_SHEET_COLUMNS.phone),
              history: findStringInArray(headings, MEMBERS_SHEET_COLUMNS.history),
              board: findStringInArray(headings, MEMBERS_SHEET_COLUMNS.board),
              projectsFirstColumn,
              depsFirstColumn,
              internationalDeps: findStringInArray(headings, MEMBERS_SHEET_COLUMNS.internationalDeps),
              internationalEvents: findStringInArray(headings, MEMBERS_SHEET_COLUMNS.internationalEvents),
            };
  
            const membersList = membersSpreadsheet
              .filter(row => row[nameColumnId] && row[statusColumnId])
              .map((row, rowId) => parseMembersSheetRow(row, rowId, columnIds, projects, departments));
  
            resolve(membersList);
          }
          const errorColumns = [];
          if (nameColumnId === -1) errorColumns.push(MEMBERS_SHEET_COLUMNS.name);
          if (statusColumnId === -1) errorColumns.push(MEMBERS_SHEET_COLUMNS.status);
          if (parentColumnId === -1) errorColumns.push(MEMBERS_SHEET_COLUMNS.parent);
          reject({type: 'columnsError', details: errorColumns.join(', ')});
        }
        reject({type: 'emptySheetError'});
      } catch(error) {
        if (error.status === 'NOT_FOUND') reject({type: 'spreadsheetIDError'});
        if (error.status === 'INVALID_ARGUMENT') reject({type: 'sheetNameError'});
      }
    });
  })
);

export default loadMembersData;
