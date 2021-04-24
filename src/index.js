import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import sheets from './config/sheets';

import {initGoogleApi, loadDataFromSpreadsheet} from './utils/googleApi';
import indexOfItemWhichStartsWith from './utils/indexOfItemWhichStartsWith';
import parseMembersSheetRow from './utils/parseMembersSheetRow';

import FamilyTree from './components/family-tree/familyTree';
import AccessLimiter from './components/access-limiter/accessLimiter';

import 'index.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      membersList: [],
    };
  }

  loadMembersData = (apiKey, spreadsheetId) => {
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
          const [projectsFirstColumn, projectsAmount] = this.getCoordsOfCell(firstRow, 'Проекти');

          if (projectsAmount) {
            for (let i = projectsFirstColumn; i < projectsFirstColumn + projectsAmount; i++) {
              projects.push(headings[i].split(' (')[0]);
            }
          }

          const departments = [];
          const [depsFirstColumn, depsAmount] = this.getCoordsOfCell(firstRow, 'Департаменти');

          if (depsAmount) {
            for (let i = depsFirstColumn; i < depsFirstColumn + depsAmount; i++) {
              departments.push(headings[i].split(' (')[0]);
            }
          }

          this.setState({
            membersList: membersSpreadsheet.map((row, rowId) =>
              parseMembersSheetRow(row, rowId, headings, projects, departments))
          });

          resolve();
        } catch(e) {
          reject('Wrong spreadsheet ID');
        }
      });
    });
  }

  getCoordsOfCell = (row, cellValue) => {
    let span = 0;
    const firstColumn = indexOfItemWhichStartsWith(row, cellValue);
    if (firstColumn) {
      span++;
      let currentColumn = firstColumn;
      while (!row[currentColumn + 1]) {
        span++;
        currentColumn++;
      }
    }
    return [firstColumn, span];
  }

  render() {
    const {membersList} = this.state;

    return (
      <AccessLimiter
        onAccessGranted={this.loadMembersData}
      >
        <FamilyTree membersList={membersList}/>
      </AccessLimiter>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
