import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {dashboardSheet, membersSheet} from './config/sheets';

import {initGoogleApi, loadDataFromSpreadsheet} from './utils/googleApi';
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
          const projectsAndDepsData = await loadDataFromSpreadsheet({
            spreadsheetId,
            sheetName: dashboardSheet.name,
            startRow: dashboardSheet.startRow,
            rowWidth: dashboardSheet.columnsOrder.length,
          })

          const amountOfProjects = +projectsAndDepsData[0][1];
          const amountOfDepartments = +projectsAndDepsData[1][1];

          const membersData = await loadDataFromSpreadsheet({
            spreadsheetId,
            sheetName: membersSheet.name,
            startRow: membersSheet.startRow,
            rowWidth: membersSheet.columnsOrder.length + amountOfProjects + amountOfDepartments,
          })

          const firstRow = membersData[0];
          await membersData.shift();

          const projects = [];
          const firstProjectColumn = membersSheet.columnsOrder.length;
          for (let i = firstProjectColumn; i < firstProjectColumn + amountOfProjects; i++) {
            projects.push(firstRow[i].split(' (')[0]);
          }

          const departments = [];
          const firstDepartmentColumn = membersSheet.columnsOrder.length + amountOfProjects;
          for (let i = firstDepartmentColumn; i < firstDepartmentColumn + amountOfDepartments; i++) {
            departments.push(firstRow[i].split(' (')[0]);
          }

          this.setState({
            membersList: membersData.map((row, rowId) => parseMembersSheetRow(row, rowId, projects, departments))
          });

          resolve();
        } catch(e) {
          reject('Wrong spreadsheet ID');
        }
      });
    });
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
