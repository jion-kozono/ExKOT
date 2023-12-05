import { ATTENDANCE_STATUS } from "../const";
import { sendAttendanceReport } from "../send";

export const setTestButtonInDOM = () => {
  const testBtn = document.createElement("testButton") as HTMLButtonElement;
  testBtn.innerText = "TEST BUTTON";
  testBtn.style.position = "fixed";
  testBtn.style.top = "50%";
  testBtn.style.left = "50%";
  testBtn.style.transform = "translate(-50%, -50%)";
  testBtn.addEventListener(
    "click",
    async function () {
      await sendAttendanceReport(ATTENDANCE_STATUS.COME);
    },
    false,
  );
  document.body.appendChild(testBtn);
};
