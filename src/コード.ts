// https://github.com/7wataaa/abc-bot/blob/master/src/%E3%82%B3%E3%83%BC%E3%83%89.ts

function myFunction() {
  const getUrl = 'https://example.com/';

  Utilities.sleep(5000);

  const html = UrlFetchApp.fetch(getUrl).getContentText('UTF-8');

  console.log(Parser.data(html).from('<h1>').to('</h1>').build());
}
