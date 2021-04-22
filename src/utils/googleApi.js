const loadDataFromSpreadsheet = (spreadsheetId, sheetName) => {
  return new Promise((resolve, reject) => {
    window.gapi.client.load('sheets', 'v4', () => {
      window.gapi.client.sheets.spreadsheets.values
        .get({spreadsheetId, range: `${sheetName}!A1:BG1000`})
        .then(
          response => resolve(response.result.values),
          response => reject(response.result.error)
        );
    });
  });
}

const initGoogleApi = apiKey =>
  window.gapi.client.init({apiKey, discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']});

export {initGoogleApi, loadDataFromSpreadsheet};
