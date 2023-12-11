import {
  hideBreakAndRestartButtonInDOM,
  setBreakButtonInDOM,
  setRestartButtonInDOM,
} from "./components/BreakRestartButton";
import { setTestButtonInDOM } from "./components/TestButton";
import {
  APP_ENV,
  ATTENDANCE_STATUS,
  AttendanceStatusTye,
  channelDomain,
  channelName,
  innerHTML,
  messages,
} from "./const";
import { sendAttendanceReport } from "./send";
import {
  getAttendanceStatusFromChromeStorage,
  getSettingsFromChromeStorage,
} from "./storage/storage";

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

// KOTのタイムレコーダーページでイベントリスナーを設定
async function setEventListener() {
  if (APP_ENV === "dev") {
    setTestButtonInDOM();
  }
  const attendanceStatus = await getAttendanceStatusFromChromeStorage();
  console.log({ attendanceStatus });
  setComingButtonEventListener();
  setLeavingButtonEventListener();

  // 退勤ボタンは初期時押せない
  if (isLeavingButtonDisabled) {
    leavingBtn.style.display = "none";
  }
  const settingItemObject = await getSettingsFromChromeStorage();

  if (!settingItemObject.discordWebhookUrl.startsWith(channelDomain)) {
    window.alert(messages.URL_SETTING_ALERT);
  } else {
    window.alert(`打刻すると指定した${channelName}チャネルに勤怠報告が送信されます。`);
  }

  if (attendanceStatus && attendanceStatus !== ATTENDANCE_STATUS.LEAVE) {
    hideButton(ATTENDANCE_STATUS.COME);
  }
  if (
    attendanceStatus === ATTENDANCE_STATUS.COME ||
    attendanceStatus === ATTENDANCE_STATUS.RESTART
  ) {
    window.alert("現在出勤中です。");
    setBreakButtonInDOM();
  } else if (attendanceStatus === ATTENDANCE_STATUS.BREAK) {
    setRestartButtonInDOM();
    window.alert("現在休憩中です。");
  }

  // ローディング画面を非表示
  const loadingElement = document.querySelector("#myLoading") as HTMLElement;

  if (loadingElement) {
    loadingElement.style.display = "none";
  }
}

const setComingButtonEventListener = (): HTMLElement => {
  recordBtnOuters = document.querySelectorAll(".record-btn-outer.record");
  // 出勤ボタン
  comingBtn = recordBtnOuters[0] as HTMLElement;
  if (!comingBtn) throw new Error(messages.FAILED_GET_HTML_ELEMENT);

  // 出勤ボタン押下時
  comingBtn.addEventListener(
    "click",
    async function (event) {
      console.log(event);
      if (!isComingButtonDisabled) {
        hideButton(ATTENDANCE_STATUS.COME);
        await sendAttendanceReport(ATTENDANCE_STATUS.COME);
        setBreakButtonInDOM();
      }
    },
    false,
  );
  return comingBtn;
};

const setLeavingButtonEventListener = (): HTMLElement => {
  recordBtnOuters = document.querySelectorAll(".record-btn-outer.record");
  // 退勤ボタン
  leavingBtn = recordBtnOuters[1] as HTMLElement;

  if (!leavingBtn) throw new Error(messages.FAILED_GET_HTML_ELEMENT);

  // 退勤ボタン押下時
  leavingBtn.addEventListener(
    "click",
    async function (event) {
      console.log(event);
      if (!isLeavingButtonDisabled) {
        hideButton(ATTENDANCE_STATUS.LEAVE);
        await sendAttendanceReport(ATTENDANCE_STATUS.LEAVE);
        // 休憩、再開ボタンの非表示
        hideBreakAndRestartButtonInDOM();
      }
    },
    false,
  );
  return leavingBtn;
};

const hideButton = (attendanceStatus: AttendanceStatusTye) => {
  if (attendanceStatus === ATTENDANCE_STATUS.COME) {
    isComingButtonDisabled = true;
    isLeavingButtonDisabled = false;
    // ボタンの無効化処理
    comingBtn.style.display = "none";
    // 退勤ボタンの活性化
    if (!leavingBtn) {
      leavingBtn = setLeavingButtonEventListener();
    }
    leavingBtn.style.display = "";
  } else {
    isLeavingButtonDisabled = true;
    isComingButtonDisabled = false;
    // ボタンの無効化処理
    leavingBtn.style.display = "none";
    if (!comingBtn) {
      comingBtn = setComingButtonEventListener();
    }
    comingBtn.style.display = "";
  }
};

// DOM生成に1sまって、イベントリスナーを登録
setTimeout(setEventListener, 1000);
