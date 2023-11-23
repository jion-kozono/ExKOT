import { channelDomain, defaultMessage } from "./const";

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("saveBtn")?.addEventListener("click", saveOptionSettings);
  // HTMLが読み込まれたら初期値を設定
  chrome.storage.sync.get(
    ["discordWebhookUrl", "comingMessage", "leavingMessage"],
    function (items) {
      const url = document.getElementById("webhookUrl") as HTMLInputElement;
      url.value = items.discordWebhookUrl || "";
      const comingMessage = document.getElementById("comingMessage") as HTMLInputElement;
      comingMessage.value = items.comingMessage || "";
      const leavingMessage = document.getElementById("leavingMessage") as HTMLInputElement;
      leavingMessage.value = items.leavingMessage || "";
    },
  );
});

const saveOptionSettings = () => {
  const webhookUrl = (document.getElementById("webhookUrl") as HTMLInputElement)?.value;
  const comingMessage = (document.getElementById("comingMessage") as HTMLInputElement)?.value;
  const leavingMessage = (document.getElementById("leavingMessage") as HTMLInputElement)?.value;

  if (!webhookUrl?.startsWith(channelDomain)) {
    alert("Please enter a valid Webhook URL");
    return;
  }
  // 保存後、必要であれば再度初期値を設定する
  chrome.storage.sync.set(
    {
      discordWebhookUrl: webhookUrl,
      comingMessage: comingMessage || defaultMessage.defaultComingMessage,
      leavingMessage: leavingMessage || defaultMessage.defaultLeavingMessage,
    },
    function () {
      alert("Settings saved!");
    },
  );
};
