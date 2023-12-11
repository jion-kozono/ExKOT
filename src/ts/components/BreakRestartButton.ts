import { ATTENDANCE_STATUS, COLOR } from "../const";
import { sendAttendanceReport } from "../send";

import { setButtonStyle } from "./Button";

let breakBtn: HTMLButtonElement | undefined;
let restartBtn: HTMLButtonElement | undefined;

/**
 * 休憩ボタンを表示する
 */
export const setBreakButtonInDOM = () => {
  breakBtn = document.createElement("button") as HTMLButtonElement;
  breakBtn.id = "breakButton";
  breakBtn.textContent = "休憩";
  setButtonStyle(breakBtn, COLOR.BREAK);
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

export const setRestartButtonInDOM = () => {
  restartBtn = document.createElement("button") as HTMLButtonElement;
  restartBtn.id = "restartButton";
  restartBtn.textContent = "再開";
  setButtonStyle(restartBtn, COLOR.RESTART);
  restartBtn.addEventListener(
    "click",
    async function () {
      hideRestartButtonInDOM();
      await sendAttendanceReport(ATTENDANCE_STATUS.RESTART);
      setBreakButtonInDOM();
    },
    false,
  );
  document.body.appendChild(restartBtn);
};

/**
 * 休憩ボタンを非表示にする
 */
const hideBreakButtonInDOM = () => {
  if (breakBtn) {
    // ボタンの無効化処理
    breakBtn.style.display = "none";
  }

  if (restartBtn) {
    // 再開ボタンの活性化
    restartBtn.style.display = "";
  }
};

/**
 * 再開ボタンを非表示にする
 */
const hideRestartButtonInDOM = () => {
  if (restartBtn) {
    // ボタンの無効化処理
    restartBtn.style.display = "none";
  }
  if (breakBtn) {
    // 再開ボタンの活性化
    breakBtn.style.display = "";
  }
};

/**
 * 休憩・再開ボタンを非表示にする
 */
export const hideBreakAndRestartButtonInDOM = () => {
  if (restartBtn) {
    // ボタンの無効化処理
    restartBtn.style.display = "none";
  }
  if (breakBtn) {
    // 再開ボタンの活性化
    breakBtn.style.display = "none";
  }
};
