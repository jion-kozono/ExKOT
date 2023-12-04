import { setTestButtonInDOM } from "./components/TestButton";
import { APP_ENV, channelDomain, channelName, defaultMessage, innerHTML, messages } from "./const";

const loadingElement = document.createElement("div");
loadingElement.innerHTML = innerHTML;
document.body.appendChild(loadingElement);

let recordBtnOuters: NodeListOf<Element>;
// 出勤ボタン
let comingBtn: HTMLElement;
// 退勤ボタン
let leavingBtn: HTMLElement;

let isComingButtonDisabled = false;
let isLeavingButtonDisabled = true;

// chrome拡張のストレージから設定データ取得
const getSettingsFromChromeStorage = async (): Promise<{
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

// 初期ロード時にchrome拡張のストレージから出勤ステータス取得
const getAttendanceStatusFromChromeStorage = async (): Promise<boolean | undefined> => {
  const items = (await chrome.storage.sync.get(["attendanceStatus"])) as {
    attendanceStatus: boolean;
  };

  const attendanceStatus = items.attendanceStatus;
  // TODO* console.oog(外す)
  console.log({ attendanceStatus });
  if (attendanceStatus) {
    disableButton(true);
    window.alert("現在出勤中です。");
  }

  return attendanceStatus;
};

const setAttendanceStatusToChromeStorage = (attendanceStatus: boolean): void => {
  // 保存後、必要であれば再度初期値を設定する
  chrome.storage.sync.set({
    attendanceStatus,
  });
};

// KOTのタイムレコーダーページでイベントリスナーを設定
async function setEventListener() {
  if (APP_ENV === "dev") {
    setTestButtonInDOM(sendAttendanceReport);
  }

  recordBtnOuters = document.querySelectorAll(".record-btn-outer.record");
  // 出勤ボタン
  comingBtn = recordBtnOuters[0] as HTMLElement;
  // 退勤ボタン
  leavingBtn = recordBtnOuters[1] as HTMLElement;

  await getAttendanceStatusFromChromeStorage();

  if (!comingBtn || !leavingBtn) return;

  // 出勤ボタン押下時
  comingBtn.addEventListener(
    "click",
    async function () {
      if (!isComingButtonDisabled) {
        disableButton(true);
        await sendAttendanceReport(true);
      }
    },
    false,
  );

  // 退勤ボタン押下時
  leavingBtn.addEventListener(
    "click",
    async function () {
      if (!isLeavingButtonDisabled) {
        disableButton(false);
        await sendAttendanceReport(false);
      }
    },
    false,
  );
  // 退勤ボタンは初期時押せない
  if (isLeavingButtonDisabled) {
    leavingBtn.style.display = "none";
  }
  const { discordWebhookUrl } = await getSettingsFromChromeStorage();

  if (!discordWebhookUrl?.startsWith(channelDomain)) {
    window.alert(messages.URL_SETTING_ALERT);
  } else {
    window.alert(`打刻すると指定した${channelName}チャネルに勤怠報告が送信されます。`);
  }

  // ローディング画面を非表示
  const loadingElement = document.querySelector("#myLoading") as HTMLElement;

  if (loadingElement) {
    loadingElement.style.display = "none";
  }
}

//出勤、退勤ボタン押下時に処理を挿入
async function sendAttendanceReport(attendanceStatus: boolean) {
  setAttendanceStatusToChromeStorage(attendanceStatus);
  const { discordWebhookUrl, comingMessage, leavingMessage } = await getSettingsFromChromeStorage();

  if (!discordWebhookUrl?.startsWith(channelDomain)) {
    window.alert(`
    ${messages.URL_SETTING_ALERT}
    ${messages.SUCCESS_CLOCKED}
    `);
    return;
  }

  const message = attendanceStatus ? comingMessage : leavingMessage;
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
      window.alert(messages.FAILED_SEND_MESSAGE);
    }
  });
}

const disableButton = (attendanceStatus: boolean) => {
  if (attendanceStatus) {
    isComingButtonDisabled = true;
    isLeavingButtonDisabled = false;
    // ボタンの無効化処理
    comingBtn.style.display = "none";
    // 退勤ボタンの活性化
    leavingBtn.style.display = "";
  } else {
    isLeavingButtonDisabled = true;
    isComingButtonDisabled = false;
    // ボタンの無効化処理
    leavingBtn.style.display = "none";
    // 出勤ボタンの活性化
    comingBtn.style.display = "";
  }
};

// DOM生成に1sまって、イベントリスナーを登録
setTimeout(setEventListener, 1000);
