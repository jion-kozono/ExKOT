(async () => {
  // これを入れないとエラーになる。。
  globalThis.exports = {};

  const src = chrome.runtime.getURL("entry/index.js");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contentMain = await import(src);
})();
