import {
  ATTENDANCE_STATUS,
  AttendanceStatusTye,
  channelDomain,
  channelName,
  messages,
} from "./const";
import {
  getSettingsFromChromeStorage,
  setAttendanceStatusToChromeStorage,
} from "./storage/storage";

/**
 * ボタン押下時に指定したチャンネルにメッセージを送信する処理
 */
export const sendAttendanceReport = async (attendanceStatus: AttendanceStatusTye) => {
  const [settingItemObject] = await Promise.all([
    getSettingsFromChromeStorage(),
    setAttendanceStatusToChromeStorage(attendanceStatus),
  ]);

  if (!settingItemObject.discordWebhookUrl.startsWith(channelDomain)) {
    window.alert(`
    ${messages.URL_SETTING_ALERT}
    ${messages.SUCCESS_CLOCKED}
    `);
    return;
  }
  let message = "";
  switch (attendanceStatus) {
    case ATTENDANCE_STATUS.COME:
      message = settingItemObject.comingMessage;
      break;
    case ATTENDANCE_STATUS.LEAVE:
      message = settingItemObject.leavingMessage;
      break;
    case ATTENDANCE_STATUS.BREAK:
      message = settingItemObject.breakingMessage;
      break;
    case ATTENDANCE_STATUS.RESTART:
      message = settingItemObject.leavingMessage;
      break;
    default:
      break;
  }

  const param = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: message,
    }),
  };

  fetch(settingItemObject.discordWebhookUrl, param).then((response) => {
    if (response.ok) {
      window.alert(`${channelName}チャネルに"${message}"というメッセージが送信されました。`);
    } else {
      console.error("error", response);
      window.alert(messages.FAILED_SEND_MESSAGE);
    }
  });
};
