import React from 'react';
import {useDispatch} from 'react-redux';
import {setMembersListAction} from 'store/reducer';

import sheets from 'config/sheets';

import {initGoogleApi, loadDataFromSpreadsheet} from 'utils/googleApi';
import {findStringInArray} from 'utils/arrayUtils';
import parseMembersSheetRow from 'utils/parseMembersSheetRow';

import AccessLimiter from 'components/access-limiter/accessLimiter';
import Search from 'components/search/search';
import FamilyTree from 'components/family-tree/familyTree';

import 'app.scss';

const App = () => {
  const dispatch = useDispatch();

  const loadMembersData = (apiKey, spreadsheetId) => {
    const findCellSpanInRow = (row, cellValue) => {
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

    return new Promise((resolve, reject) => {
      window.gapi.load('client', async () => {
        try {
          await initGoogleApi(apiKey);
        } catch(e) {
          reject('Wrong Google API key');
        }

        try {
          const membersSpreadsheet = await loadDataFromSpreadsheet(spreadsheetId, sheets.members);

          const firstRow = membersSpreadsheet[0];
          await membersSpreadsheet.shift();

          const headings = membersSpreadsheet[0];
          await membersSpreadsheet.shift();

          const projects = [];
          const [projectsFirstColumn, projectsAmount] = findCellSpanInRow(firstRow, 'Проекти');

          if (projectsAmount) {
            for (let i = projectsFirstColumn; i < projectsFirstColumn + projectsAmount; i++) {
              projects.push(headings[i].split(' (')[0]);
            }
          }

          const departments = [];
          const [depsFirstColumn, depsAmount] = findCellSpanInRow(firstRow, 'Департаменти');

          if (depsAmount) {
            for (let i = depsFirstColumn; i < depsFirstColumn + depsAmount; i++) {
              departments.push(headings[i].split(' (')[0]);
            }
          }

          const membersList = membersSpreadsheet.map((row, rowId) =>
            parseMembersSheetRow(row, rowId, headings, projects, departments));

          dispatch(setMembersListAction(membersList));

          resolve();
        } catch(e) {
          reject('Wrong spreadsheet ID');
        }
      });
    });
  }

  return (
    <AccessLimiter onAccessGranted={loadMembersData}>
      <Search />
      <FamilyTree />
    </AccessLimiter>
  );
}

export default App;
