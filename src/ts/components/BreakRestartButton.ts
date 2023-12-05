import { ATTENDANCE_STATUS } from "../const";
import { sendAttendanceReport } from "../send";

let breakBtn: HTMLButtonElement | undefined;
let restartButton: HTMLButtonElement | undefined;

const createBreakBtn = (): HTMLButtonElement => {
  breakBtn = document.createElement("breakButton") as HTMLButtonElement;
  return breakBtn;
};

const createRestartBtn = (): HTMLButtonElement => {
  restartButton = document.createElement("restartButton") as HTMLButtonElement;
  return restartButton;
};

/**
 * 休憩ボタンを表示する
 */
export const setBreakButtonInDOM = () => {
  if (!breakBtn) {
    breakBtn = createBreakBtn();
  }
  breakBtn.innerText = "休憩";
  breakBtn.style.position = "fixed";
  breakBtn.style.top = "50%";
  breakBtn.style.left = "50%";
  breakBtn.style.transform = "translate(-50%, -50%)";
  breakBtn.addEventListener(
    "click",
    async function () {
      hideBreakButtonInDOM();
      await sendAttendanceReport(ATTENDANCE_STATUS.BREAK);
      setRestartButtonInDOM();
    },
    false,
  );
  document.body.appendChild(breakBtn);
};

/**
 * 再開ボタンを表示する
 */

const setRestartButtonInDOM = () => {
  if (!restartButton) {
    restartButton = createRestartBtn();
  }
  restartButton.innerText = "再開";
  restartButton.style.position = "fixed";
  restartButton.style.top = "50%";
  restartButton.style.left = "50%";
  restartButton.style.transform = "translate(-50%, -50%)";
  restartButton.addEventListener(
    "click",
    async function () {
      hideRestartButtonInDOM();
      await sendAttendanceReport(ATTENDANCE_STATUS.RESTART);
    },
    false,
  );
  document.body.appendChild(restartButton);
};

/**
 * 休憩ボタンを非表示にする
 */
const hideBreakButtonInDOM = () => {
  if (!breakBtn) {
    breakBtn = createBreakBtn();
    // ボタンの無効化処理
    breakBtn.style.display = "none";
  }

  if (!restartButton) {
    restartButton = createRestartBtn();
    // 再開ボタンの活性化
    restartButton.style.display = "";
  }
};

/**
 * 再開ボタンを非表示にする
 */
const hideRestartButtonInDOM = () => {
  if (!restartButton) {
    restartButton = createRestartBtn();
    // ボタンの無効化処理
    restartButton.style.display = "none";
  }
  if (!breakBtn) {
    breakBtn = createBreakBtn();
    // 再開ボタンの活性化
    breakBtn.style.display = "";
  }
};

/**
 * 休憩・再開ボタンを非表示にする
 */
export const hideBreakAndRestartButtonInDOM = () => {
  if (restartButton) {
    // ボタンの無効化処理
    restartButton.style.display = "none";
  }
  if (breakBtn) {
    // 再開ボタンの活性化
    breakBtn.style.display = "node";
  }
};
