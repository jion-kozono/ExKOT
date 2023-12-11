import { SETTING_ITEM_LIST, SETTING_ITEM_OBJECT, channelDomain, defaultMessage } from "./const";
import { getSettingsFromChromeStorage } from "./storage/storage";

document.addEventListener("DOMContentLoaded", async () => {
  const settingItemObject = await getSettingsFromChromeStorage();
  document.getElementById("saveBtn")?.addEventListener("click", saveOptionSettings);
  document.getElementById("closeBtn")?.addEventListener("click", closeWindow);

  for (const setting_item of SETTING_ITEM_LIST) {
    const element = document.getElementById(setting_item) as HTMLInputElement;
    if (element) {
      element.value = settingItemObject[setting_item] || "";
    }
  }
});

const closeWindow = () => {
  window.close();
};
const saveOptionSettings = () => {
  const {
    DISCORD_WEBHOOK_URL,
    COMING_MESSAGE,
    LEAVING_MESSAGE,
    BREAKING_MESSAGE,
    RESTARTING_MESSAGE,
  } = SETTING_ITEM_OBJECT;
  const discordWebhookUrl = (document.getElementById(DISCORD_WEBHOOK_URL) as HTMLInputElement)
    ?.value;
  const comingMessage = (document.getElementById(COMING_MESSAGE) as HTMLInputElement)?.value;
  const leavingMessage = (document.getElementById(LEAVING_MESSAGE) as HTMLInputElement)?.value;
  const breakingMessage = (document.getElementById(BREAKING_MESSAGE) as HTMLInputElement)?.value;
  const restartingMessage = (document.getElementById(RESTARTING_MESSAGE) as HTMLInputElement)
    ?.value;

  if (!discordWebhookUrl?.startsWith(channelDomain)) {
    alert("Please enter a valid Webhook URL");
    return;
  }
  // 保存後、必要であれば再度初期値を設定する
  chrome.storage.sync.set(
    {
      discordWebhookUrl: discordWebhookUrl,
      comingMessage: comingMessage || defaultMessage.defaultComingMessage,
      leavingMessage: leavingMessage || defaultMessage.defaultLeavingMessage,
      breakingMessage: breakingMessage || defaultMessage.defaultBreakingMessage,
      restartingMessage: restartingMessage || defaultMessage.defaultRestartingMessage,
    },
    function () {
      alert("Settings saved!");
      closeWindow();
    },
  );
};
