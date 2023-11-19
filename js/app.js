const defaultMessage = {
  defaultComingMessage: '勤務開始します。',
  defaultLeavingMessage: '勤務終了します。'
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveBtn").addEventListener("click", saveSettings);
  // HTMLが読み込まれたら初期値を設定
  chrome.storage.sync.get(['discordWebhookURL', 'name', 'comingMessage', 'leavingMessage'], function(items) {
      document.getElementById('webhookUrl').value = items.discordWebhookURL || '';
      document.getElementById('yourName').value = items.name || '';
      document.getElementById('comingMessage').value = items.comingMessage || defaultMessage.defaultComingMessage;
      document.getElementById('leavingMessage').value = items.leavingMessage || defaultMessage.defaultLeavingMessage;
  });
});

function saveSettings() {
  var webhookUrl = document.getElementById('webhookUrl').value;
  var yourName = document.getElementById('yourName').value;
  var comingMessage = document.getElementById('comingMessage').value;
  var leavingMessage = document.getElementById('leavingMessage').value;

  if (!webhookUrl || !yourName){
    if (!webhookUrl && !yourName){
      alert('Please enter a Webhook URL for Discord and your name');
    }else if (!webhookUrl){
      alert('Please enter a Webhook URL');
    }else{
      alert('Please enter your name');
    }
    return
  }
  // 保存後、必要であれば再度初期値を設定する
  chrome.storage.sync.set({
      discordWebhookURL: webhookUrl,
      name: yourName,
      comingMessage: comingMessage,
      leavingMessage: leavingMessage
  }, function () {
      alert('Settings saved!');
  });
}
