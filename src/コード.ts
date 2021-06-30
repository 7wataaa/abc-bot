const sleep = async () => 0;
async function myFunction() {
  const getUrl = 'https://example.com/';
  const html = UrlFetchApp.fetch(getUrl).getContentText('UTF-8');

  const i = sleep;
}
