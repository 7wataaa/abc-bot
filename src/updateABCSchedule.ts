// original code → https://github.com/7wataaa/abc-bot/blob/master/src/%E3%82%B3%E3%83%BC%E3%83%89.ts

function updateABCSchedule() {
  const getUrl = 'https://atcoder.jp/contests/';

  Utilities.sleep(1000);

  const html = UrlFetchApp.fetch(getUrl).getContentText('UTF-8');

  console.log('fetch完了');

  // 予定されたコンテストのdiv要素から、次の</div>内の文字列
  const upComingContestHtml = Parser.data(html)
    .from('<div id="contest-table-upcoming">')
    .to('</div>')
    .build();

  // scheduledContestHtmlからABCのみを抽出した配列
  const scheduledABCs = (
    Parser.data(upComingContestHtml)
      .from('<tr>')
      .to('</tr>')
      .iterate() as string[]
  ).filter((str) => /(AtCoder Beginner Contest)/.test(str));

  // ABCのコンテスト名の配列
  const scheduledABCNames = (
    Parser.data(scheduledABCs.join(''))
      .from('<a href="/contests/abc')
      .to('</a>')
      .iterate() as string[]
  ).map((str) => str.split('">')[1]);

  // ABCの開始時間の配列
  const scheduledABCDates = (
    Parser.data(scheduledABCs.join(''))
      .from("<time class='fixtime fixtime-full'>")
      .to('</time>')
      .iterate() as string[]
  ).map((str) => new Date(str));

  // {name: コンテスト名, date: 開始時間}の配列
  const scheduledABCValues = scheduledABCNames.map((name, i) => {
    const date = scheduledABCDates[i];

    return [date, name];
  });

  // スプレッドシートへの書き込み

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // contestsシートを取得
  const contestsSheet = ss.getSheetByName('contests');

  // これまでのコンテスト情報を削除
  contestsSheet.getDataRange().clearContent();

  // 書き込み
  contestsSheet
    .getRange(1, 1, scheduledABCValues.length, 2)
    .setValues(scheduledABCValues);
}
