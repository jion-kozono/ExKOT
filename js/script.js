import { defaultMessage } from "./const";

const channelName = "discord";

let isComingButtonDisabled = false;
let isLeavingButtonDisabled = true;

async function getChromeStorageData() {
  const items = await chrome.storage.sync.get([
    "discordWebhookURL",
    "name",
    "comingMessage",
    "leavingMessage",
  ]);

  if (!items.comingMessage)
    items.comingMessage = defaultMessage.defaultComingMessage;
  if (!items.leavingMessage)
    items.leavingMessage = defaultMessage.defaultLeavingMessage;
  return items;
}

// KOTのタイムレコーダーページでイベントリスナーを設定
function setEventListener() {
  const recordBtnOuters = document.querySelectorAll(".record-btn-outer.record");
  // 出勤ボタン
  const comingBtn = recordBtnOuters[0];
  // 退勤ボタン
  const leavingBtn = recordBtnOuters[1];

  if (comingBtn) {
    comingBtn.addEventListener(
      "click",
      async function () {
        if (!isComingButtonDisabled) {
          isComingButtonDisabled = true;
          isLeavingButtonDisabled = false;
          await sendAttendanceReport(1);
          // ボタンの無効化処理
          comingBtn.style.display = "none";
          // 退勤ボタンの活性化
          leavingBtn.style.display = "";
        }
      },
      false
    );
  }

  if (leavingBtn) {
    leavingBtn.addEventListener(
      "click",
      async function () {
        if (!isLeavingButtonDisabled) {
          isLeavingButtonDisabled = true;
          isComingButtonDisabled = false;
          await sendAttendanceReport(0);
          // ボタンの無効化処理
          leavingBtn.style.display = "none";
          // 出勤ボタンの活性化
          comingBtn.style.display = "";
        }
      },
      false
    );
  }
  // 退勤ボタンは初期時押せない
  if(isLeavingButtonDisabled && leavingBtn){
    leavingBtn.style.display = "none";
  }
  window.alert(`打刻すると指定した${channelName}チャネルに勤怠報告が送信されます。`);
}

setTimeout(setEventListener, 1000);

async function sendAttendanceReport(status) {
  const { discordWebhookURL, name, comingMessage, leavingMessage } = await getChromeStorageData();
  if (!discordWebhookURL) {
    window.alert(`
    勤怠報告をするには、拡張機能の「オプション画面」にて送信したいチャンネルのwebhookのURLを指定する必要があります。
    打刻は正常に行われています。
    `);
    return;
  }

  const message = status ? comingMessage : leavingMessage;
  const param = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: message,
    }),
  };

  fetch(discordWebhookURL, param).then((response) => {
    if (response.ok) {
      window.alert(
        `${channelName}チャネルに"${message}"というメッセージが送信されました。`
      );
    } else {
      console.log("error", response);
      window.alert("メッセージを正常に送信できませんでした。");
    }
  });
}

function decodeBase64Id(encodedId) {
  const decodedString = atob(encodedId);
  return decodedString;
}
