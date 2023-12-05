import {
  hideBreakAndRestartButtonInDOM,
  setBreakButtonInDOM,
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

  recordBtnOuters = document.querySelectorAll(".record-btn-outer.record");
  // 出勤ボタン
  comingBtn = recordBtnOuters[0] as HTMLElement;
  // 退勤ボタン
  leavingBtn = recordBtnOuters[1] as HTMLElement;

  const attendanceStatus = await getAttendanceStatusFromChromeStorage();
  if (attendanceStatus == ATTENDANCE_STATUS.COME) {
    hideButton(ATTENDANCE_STATUS.COME);
    window.alert("現在出勤中です。");
  }

  if (!comingBtn || !leavingBtn) return;

  // 出勤ボタン押下時
  comingBtn.addEventListener(
    "click",
    async function () {
      if (!isComingButtonDisabled) {
        hideButton(ATTENDANCE_STATUS.COME);
        await sendAttendanceReport(ATTENDANCE_STATUS.COME);
        setBreakButtonInDOM();
      }
    },
    false,
  );

  // 退勤ボタン押下時
  leavingBtn.addEventListener(
    "click",
    async function () {
      if (!isLeavingButtonDisabled) {
        hideButton(ATTENDANCE_STATUS.LEAVE);
        await sendAttendanceReport(ATTENDANCE_STATUS.LEAVE);
        hideBreakAndRestartButtonInDOM();
      }
    },
    false,
  );
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

  // ローディング画面を非表示
  const loadingElement = document.querySelector("#myLoading") as HTMLElement;

  if (loadingElement) {
    loadingElement.style.display = "none";
  }
}

const hideButton = (attendanceStatus: AttendanceStatusTye) => {
  if (attendanceStatus === ATTENDANCE_STATUS.COME) {
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
