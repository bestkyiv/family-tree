import React, {Component} from 'react';
import ReactDOM from 'react-dom';
// import '@testing-library/jest-dom';

import {membersSheet} from './config/sheets';

import {initGoogleApi, loadDataFromSpreadsheet} from './utils/googleApi';
import parseMembersSheetRow from './utils/parseMembersSheetRow';

import FamilyTree from './components/family-tree/familyTree';

import 'index.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      membersList: [],
    };
  }

  componentDidMount = async () => {
    this.loadMembersData(process.env.REACT_APP_GAPI_KEY, process.env.REACT_APP_SPREADSHEET_ID);

    // const response = await fetch('https://bg0lx1fae5.execute-api.eu-central-1.amazonaws.com/default/best-members-link?password=ilovebest');
    // const responseJson = await response.json();
    //
    // if (responseJson.hasOwnProperty('spreadsheetId') && responseJson.hasOwnProperty('apiKey')) {
    //   const {spreadsheetId, apiKey} = responseJson;
    //   this.loadMembersData(apiKey, spreadsheetId);
    // } else
    //   console.log(responseJson.error);
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

    return <FamilyTree membersList={membersList}/>;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
