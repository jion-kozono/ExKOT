export const setTestButtonInDOM = (
  sendAttendanceReport: (attendanceStatus: boolean) => Promise<void>,
) => {
  const testBtn = document.createElement("button") as HTMLButtonElement;
  testBtn.innerText = "TEST BUTTON";
  testBtn.style.position = "fixed";
  testBtn.style.top = "50%";
  testBtn.style.left = "50%";
  testBtn.style.transform = "translate(-50%, -50%)";
  testBtn.addEventListener(
    "click",
    async function () {
      await sendAttendanceReport(true);
    },
    false,
  );
  document.body.appendChild(testBtn);
};
