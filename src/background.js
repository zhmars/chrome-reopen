chrome.browserAction.onClicked.addListener(function () {
  chrome.sessions.restore()
})
