export const defaultMessage = {
  defaultComingMessage: "勤務開始します。",
  defaultLeavingMessage: "勤務終了します。",
  defaultBreakingMessage: "休憩します。",
  defaultRestartingMessage: "再開します。",
} as const;

export const channelName = "discord";
export const channelDomain = "https://discord.com/api/webhooks/";
export const innerHTML = `
  <style>
    #myLoading {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      justify-content: center;
      align-items: center;
      z-index: 500;
    }
    .loader {
      border: 4px solid #f3f3f3; /* Light grey */
      border-top: 4px solid #3498db; /* Blue */
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 2s linear infinite; /* 回転アニメーションを追加 */
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
  <div id="myLoading">
    <div class="loader"></div>
  </div>
`;
export const messages = {
  URL_SETTING_ALERT:
    "勤怠報告をするには、拡張機能の「オプション画面」にて送信したいチャンネルのwebhookのUrlを指定する必要があります。",
  SUCCESS_CLOCKED: "打刻は正常に行われています。",
  FAILED_SEND_MESSAGE: "メッセージを正常に送信できませんでした。",
  FAILED_GET_HTML_ELEMENT: "HTML要素の取得に失敗しました。",
};

export const ATTENDANCE_STATUS = {
  COME: "come",
  LEAVE: "leave",
  BREAK: "break",
  RESTART: "restart",
} as const;

export type AttendanceStatusTye = (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

export const SETTING_ITEM_OBJECT = {
  DISCORD_WEBHOOK_URL: "discordWebhookUrl",
  COMING_MESSAGE: "comingMessage",
  LEAVING_MESSAGE: "leavingMessage",
  BREAKING_MESSAGE: "breakingMessage",
  RESTARTING_MESSAGE: "restartingMessage",
} as const;

type SettingItemObjectKeyType = (typeof SETTING_ITEM_OBJECT)[keyof typeof SETTING_ITEM_OBJECT];
export type PartialSettingItemObjectType = Partial<SettingItemObjectType>;
export type SettingItemObjectType = {
  [key in SettingItemObjectKeyType]: string;
};
export const SETTING_ITEM_LIST = Object.values(SETTING_ITEM_OBJECT);

export const COLOR = {
  BREAK: "#ffa732",
  RESTART: "#4caf50",
  TEST: "#3498db",
};

export const APP_ENV: "dev" | "prod" = "dev";
