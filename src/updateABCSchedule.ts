// original code → https://github.com/7wataaa/abc-bot/blob/master/src/updateABCSchedule.ts

function updateABCSchedule() {
  const zip = (...arrays: any[]) => {
    const minLength = Math.min(...arrays.map((arr) => arr.length));

    return new Array(minLength)
      .fill([])
      .map((_, i) => arrays.map((arr) => arr[i]));
  };

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
      .iterate() as Array<string | undefined>
  ).map((str) => (typeof str === 'string' ? str.split('">')[1] : undefined));

  // ABCの開始時間の配列
  const scheduledABCDates = (
    Parser.data(scheduledABCs.join(''))
      .from("<time class='fixtime fixtime-full'>")
      .to('</time>')
      .iterate() as string[]
  ).map((str) => new Date(str).toISOString());

  // ABCのURLの配列
  const scheduledABCURLs = (
    Parser.data(scheduledABCs.join(''))
      .from('<a href="/')
      .to('">')
      .iterate() as string[]
  ).map((str) => `https://atcoder.jp/${str}`);

  // コンテスト名, 開始時間, リンクの2次元配列
  const scheduledABCValues = zip(
    scheduledABCDates,
    scheduledABCNames,
    scheduledABCURLs
  );

  console.log(scheduledABCValues);

  if (
    !scheduledABCNames ||
    !scheduledABCDates ||
    !scheduledABCValues ||
    scheduledABCNames.includes(undefined) ||
    (() => {
      for (const e of scheduledABCDates) {
        if (e.toString() === 'Invalid Date') {
          return true;
        }
      }

      return false;
    })()
  ) {
    console.error('予定されたABCのデータが(正しく)取得できません');
    return;
  }

  // スプレッドシートへの書き込み

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // contestsシートを取得
  const contestsSheet = ss.getSheetByName('contests');

  // これまでのコンテスト情報を削除
  contestsSheet!.getDataRange().clearContent();

  // 書き込み
  contestsSheet!
    .getRange(1, 1, scheduledABCValues.length, 3)
    .setValues(scheduledABCValues);
}
