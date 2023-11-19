(async() => {
  const src = chrome.runtime.getURL("dist/bundle.js");
  const contentMain = await import(src);
})()
