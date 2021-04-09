import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {membersSheet} from './config/sheets';

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
    window.gapi.load('client', async () => {
      await initGoogleApi(apiKey);

      loadDataFromSpreadsheet({
        spreadsheetId,
        sheetName: membersSheet.name,
        startRow: membersSheet.startRow,
        rowWidth: membersSheet.columnsOrder.length,
      }, (err, data) => {
        if (err) {
          console.log(err.message);
          return;
        }

        this.setState({
          membersList: data.map(parseMembersSheetRow),
        });
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
