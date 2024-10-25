import { ATTENDANCE_STATUS, COLOR } from "../const";
import { sendAttendanceReport } from "../send";

import { setButtonStyle } from "./Button";

export const setTestButtonInDOM = () => {
  const testBtn = document.createElement("button") as HTMLButtonElement;
  testBtn.textContent = "TEST BUTTON";
  setButtonStyle(testBtn, COLOR.TEST);
  testBtn.addEventListener(
    "click",
    async function () {
      await sendAttendanceReport(ATTENDANCE_STATUS.COME);
    },
    false,
  );
  document.body.appendChild(testBtn);
};
