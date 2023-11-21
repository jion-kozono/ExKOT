const defaultMessage = {
  defaultComingMessage: '勤務開始します。',
  defaultLeavingMessage: '勤務終了します。'
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveBtn").addEventListener("click", saveSettings);
  // HTMLが読み込まれたら初期値を設定
  chrome.storage.sync.get(['discordWebhookURL', 'comingMessage', 'leavingMessage'], function(items) {
      document.getElementById('webhookUrl').value = items.discordWebhookURL || '';
      document.getElementById('comingMessage').value = items.comingMessage || defaultMessage.defaultComingMessage;
      document.getElementById('leavingMessage').value = items.leavingMessage || defaultMessage.defaultLeavingMessage;
  });
});

function saveSettings() {
  const webhookUrl = document.getElementById('webhookUrl').value;
  const comingMessage = document.getElementById('comingMessage').value;
  const leavingMessage = document.getElementById('leavingMessage').value;

  if (!webhookUrl){
    alert('Please enter a Webhook URL');
    return
  }
  // 保存後、必要であれば再度初期値を設定する
  chrome.storage.sync.set({
      discordWebhookURL: webhookUrl,
      comingMessage: comingMessage,
      leavingMessage: leavingMessage
  }, function () {
      alert('Settings saved!');
  });
}
