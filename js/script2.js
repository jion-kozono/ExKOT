// Slack AppのOAuth Access Tokenを指定
const slack_app_token =
  "xoxp-0123456789-012345678901-012345678901-012345xxxxxx678901xxxxxx012345xxxxxx678901xxxxxx";

// Reaction対象のメッセージを検索するQueryを定義
search_word = "Reminder: :rimokai: :rimoshu: はこのスレで！";
channel = "<チャネル名>";
from = "slackbot";
encoded_query = encodeURI(`${search_word} in:${channel} from:${from}`);

// Reactionでスタンプする絵文字を定義
emoji_in = "rimokai";
emoji_out = "rimoshu";

// Reaction対象のメッセージのchannelのIDを定義
channel_id = "<チャネルID>";

// 最新のReminderメッセージにrimokai/rimoshuをReactionする
function reaction_to_reminder(emoji_name) {
  // Slack API（search.messages）のURIを定義（Queryにヒットするtimestampが最新のメッセージを1つ取得する）
  var search_uri = `https://slack.com/api/search.messages?\
      token=${slack_app_token}&\
      query=${encoded_query}&\
      sort=timestamp&\
      sort_dir=desc&\
      count=1`;

  // Reaction対象のメッセージのtsをSlackから取得
  fetch(search_uri)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      var json = JSON.parse(JSON.stringify(myJson));
      var ts = json.messages.matches[0].ts;

      // Slack API（reactions.add）のURIを定義
      var reaction_uri = `https://slack.com/api/reactions.add?\
        token=${slack_app_token}&\
        channel=${channel_id}&\
        name=${emoji_name}&\
        timestamp=${ts}`;

      // Reactionの実行
      fetch(reaction_uri);

      window.alert(
        `メッセージ"${ts}"に"${emoji_name}"がリアクションされました。`
      );
    });
}

// KoTのタイムレコーダーページでイベントリスナーを設定
function set_event_listener() {
  // 出勤ボタンに reaction_to_reminder('rimokai') を設定
  var syukkin_elem = document.getElementsByClassName(
    "record-btn-inner record-clock-in"
  );
  syukkin_elem[0].addEventListener(
    "click",
    function () {
      reaction_to_reminder(emoji_in);
    },
    false
  );

  // 退勤ボタンに reaction_to_reminder('rimoshu') を設定
  var taikin_elem = document.getElementsByClassName(
    "record-btn-inner record-clock-out"
  );
  taikin_elem[0].addEventListener(
    "click",
    function () {
      reaction_to_reminder(emoji_out);
    },
    false
  );

  window.alert(
    `打刻すると${channel}チャネルのReminderメッセージに"${emoji_in}"/"${emoji_out}"がリアクションされます。`
  );
}

// ボタンパーツの読み込みを1秒待つ
setTimeout("set_event_listener()", 1000);
