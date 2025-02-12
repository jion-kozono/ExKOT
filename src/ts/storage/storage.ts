import {
  AttendanceStatusTye,
  PartialSettingItemObjectType,
  SETTING_ITEM_LIST,
  SettingItemObjectType,
  defaultMessage,
} from "../const";

/**
 * chrome拡張のストレージから設定データ取得
 */
export const getSettingsFromChromeStorage = async (): Promise<SettingItemObjectType> => {
  const settingItemObject: PartialSettingItemObjectType =
    await chrome.storage.sync.get(SETTING_ITEM_LIST);

  return {
    discordWebhookUrl: settingItemObject.discordWebhookUrl || "",
    comingMessage: settingItemObject.comingMessage || defaultMessage.defaultComingMessage,
    leavingMessage: settingItemObject.leavingMessage || defaultMessage.defaultLeavingMessage,
    breakingMessage: settingItemObject.breakingMessage || defaultMessage.defaultBreakingMessage,
    restartingMessage:
      settingItemObject.restartingMessage || defaultMessage.defaultRestartingMessage,
    showAlarmCheckbox: settingItemObject.showAlarmCheckbox || "true",
  };
};

/**
 * 初期ロード時にchrome拡張のストレージから出勤ステータス取得
 */
export const getAttendanceStatusFromChromeStorage = async (): Promise<
  AttendanceStatusTye | undefined
> => {
  const items = (await chrome.storage.sync.get(["attendanceStatus"])) as {
    attendanceStatus: AttendanceStatusTye;
  };

  const attendanceStatus = items.attendanceStatus;

  return attendanceStatus;
};

/**
 * 出勤ステータスをセット
 */
export const setAttendanceStatusToChromeStorage = async (
  attendanceStatus: AttendanceStatusTye,
): Promise<void> => {
  // 保存後、必要であれば再度初期値を設定する
  await chrome.storage.sync.set({
    attendanceStatus,
  });
};
