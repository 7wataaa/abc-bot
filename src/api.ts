interface contestData {
  date: Date;
  contestName: string;
}

function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const contestsSheet = ss.getSheetByName('contests');

  const payload = contestsSheet.getDataRange().isBlank()
    ? JSON.stringify([])
    : JSON.stringify(
        contestsSheet
          .getDataRange()
          .getValues()
          .map((row) => {
            return {
              date: row[0],
              contestName: row[1],
            };
          })
      );

  const output = ContentService.createTextOutput();

  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(payload);

  return output;
}
