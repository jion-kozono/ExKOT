import { defaultMessage } from "./const";

const channelName = "discord";

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
  const coming_elem = Array.from(document.getElementsByClassName("record-btn-inner record-clock-in"));
  if (coming_elem[0]) {
    coming_elem[0].addEventListener(
      "click",
      async function () {
        await send_attendance_report(1);
      },
      false
    );
  }

  const leaving_elem = Array.from(document.getElementsByClassName("record-btn-inner record-clock-out"));
  if (leaving_elem[0]) {
    leaving_elem[0].addEventListener(
      "click",
      async function () {
        await send_attendance_report(0);
      },
      false
    );
  }
  window.alert(`打刻すると指定した${channelName}チャネルに勤怠報告が送信されます。`);
}

setTimeout(setEventListener, 1000);

async function send_attendance_report(status) {
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
