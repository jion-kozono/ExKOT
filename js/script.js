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
  const comingElem = document.querySelector(".record-btn-inner.record-clock-in");
  const leavingElem = document.querySelector(".record-btn-inner.record-clock-out");

  if (comingElem) {
    comingElem.addEventListener(
      "click",
      async function () {
        if (!isComingButtonDisabled) {
          isComingButtonDisabled = true;
          isLeavingButtonDisabled = false;
          await sendAttendanceReport(1);
          // ボタンの無効化処理
          comingElem.style.pointerEvents = "none";
          comingElem.style.background = "#8e8e8e";
          console.log({disabled: comingElem.style.pointerEvents})
          // 退勤ボタンの活性化
          leavingElem.style.pointerEvents = "auto";
        }
      },
      false
    );
  }

  if (leavingElem) {
    leavingElem.addEventListener(
      "click",
      async function () {
        if (!isLeavingButtonDisabled) {
          isLeavingButtonDisabled = true;
          isComingButtonDisabled = false;
          await sendAttendanceReport(0);
          // ボタンの無効化処理
          leavingElem.style.pointerEvents = "none";
          leavingElem.style.background = "#8e8e8e";
          removeClass(comingElem, ["record-btn-inner-hover", "record-clock-out-inner-hover"])
          // 出勤ボタンの活性化
          comingElem.style.pointerEvents = "auto";
        }
      },
      false
    );
  }
  // 退勤ボタンは初期時押せない
  if(isLeavingButtonDisabled){
    leavingElem.style.pointerEvents = "none";
    leavingElem.style.background = "#8e8e8e";
  }else{
    leavingElem.style.pointerEvents = "auto";
    leavingElem.style.background = undefined;
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

function removeClass(element, classNames) {
  if (element.classList) {
    classNames.forEach(className => {
      element.classList.remove(className);
    });
  }
}
