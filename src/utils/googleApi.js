const getColumnLetterById = id => {
  let temp, letter = '';
  while (id > 0) {
    temp = (id - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    id = (id - temp - 1) / 26;
  }
  return letter;
}

const loadDataFromSpreadsheet = ({
  spreadsheetId,
  sheetName,
  startRow = 1,
  startCol = 1,
  rowWidth = 1,
}) => {
  return new Promise((resolve, reject) => {
    const range = `${sheetName}!${getColumnLetterById(startCol)}${startRow}:${getColumnLetterById(rowWidth)}`;

    window.gapi.client.load('sheets', 'v4', () => {
      window.gapi.client.sheets.spreadsheets.values
        .get({spreadsheetId, range})
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
