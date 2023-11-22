import { APP_ENV, channelDomain, channelName, defaultMessage } from "./const";

const loadingElement = document.createElement("div");
loadingElement.innerHTML = `
  <style>
    #myLoading {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      justify-content: center;
      align-items: center;
      z-index: 500;
    }
    .loader {
      border: 4px solid #f3f3f3; /* Light grey */
      border-top: 4px solid #3498db; /* Blue */
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 2s linear infinite; /* 回転アニメーションを追加 */
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
  <div id="myLoading">
    <div class="loader"></div>
  </div>
`;
document.body.appendChild(loadingElement);

let isComingButtonDisabled = false;
let isLeavingButtonDisabled = true;

// DOM生成に1sまって、イベントリスナーを登録
setTimeout(setEventListener, 1000);

// chrome拡張のストレージからデータ取得
const getChromeStorageData = async (): Promise<{
  discordWebhookUrl: string;
  name: string;
  comingMessage: string;
  leavingMessage: string;
}> => {
  const items = (await chrome.storage.sync.get([
    "discordWebhookUrl",
    "name",
    "comingMessage",
    "leavingMessage",
  ])) as {
    discordWebhookUrl: string;
    name: string;
    comingMessage: string;
    leavingMessage: string;
  };

  if (!items.comingMessage) items.comingMessage = defaultMessage.defaultComingMessage;
  if (!items.leavingMessage) items.leavingMessage = defaultMessage.defaultLeavingMessage;
  return items;
};

// KOTのタイムレコーダーページでイベントリスナーを設定
function setEventListener() {
  if (APP_ENV === "dev") {
    setTestButtonInDOM();
  }

  const recordBtnOuters = document.querySelectorAll(".record-btn-outer.record");
  // 出勤ボタン
  const comingBtn = recordBtnOuters[0] as HTMLElement;
  // 退勤ボタン
  const leavingBtn = recordBtnOuters[1] as HTMLElement;

  if (!comingBtn || !leavingBtn) return;

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
    false,
  );

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
    false,
  );
  // 退勤ボタンは初期時押せない
  if (isLeavingButtonDisabled) {
    leavingBtn.style.display = "none";
  }
  window.alert(`打刻すると指定した${channelName}チャネルに勤怠報告が送信されます。`);
  // ローディング画面を非表示
  const loadingElement = document.querySelector("#myLoading") as HTMLElement;

  if (loadingElement) {
    loadingElement.style.display = "none";
  }
}

//出勤、退勤ボタン押下時に処理を挿入
async function sendAttendanceReport(status: 0 | 1) {
  const { discordWebhookUrl, comingMessage, leavingMessage } = await getChromeStorageData();

  if (!discordWebhookUrl?.startsWith(channelDomain)) {
    window.alert(`
    勤怠報告をするには、拡張機能の「オプション画面」にて送信したいチャンネルのwebhookのUrlを指定する必要があります。
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

  fetch(discordWebhookUrl, param).then((response) => {
    if (response.ok) {
      window.alert(`${channelName}チャネルに"${message}"というメッセージが送信されました。`);
    } else {
      console.error("error", response);
      window.alert("メッセージを正常に送信できませんでした。");
    }
  });
}

const setTestButtonInDOM = () => {
  const testBtn = document.createElement("button") as HTMLButtonElement;
  testBtn.innerText = "TEST BUTTON";
  testBtn.style.position = "fixed";
  testBtn.style.top = "50%";
  testBtn.style.left = "50%";
  testBtn.style.transform = "translate(-50%, -50%)";
  testBtn.addEventListener(
    "click",
    async function () {
      await sendAttendanceReport(1);
    },
    false,
  );
  document.body.appendChild(testBtn);
};
