const getLetterById = letterId => (letterId + 9).toString(36).toUpperCase();

const loadSheetData = ({sheet, startRow = 1, startCol = 1, rowWidth = 1}, callback) => {
  window.gapi.client.load('sheets', 'v4', () => {
    window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
        range: `${sheet}!${getLetterById(startCol)}${startRow}:${getLetterById(rowWidth)}`,
      })
      .then(
        response => callback(null, response.result.values),
        response => callback(response.result.error)
      );
  });
}

const initGoogleApi = () => {
  return window.gapi.client
    .init({
      apiKey: process.env.REACT_APP_GAPI_KEY,
      discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    });
};

export {initGoogleApi, loadSheetData};
