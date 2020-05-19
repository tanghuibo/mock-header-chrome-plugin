chrome.webRequest.onBeforeSendHeaders.addListener(
  function (request) {
    let requestHeaders = request.requestHeaders;
    requestHeaders.push({
      name: "mock-test",
      value: '{"username": "thb"}',
    });
    return { requestHeaders };
  },
  {
    urls: ["<all_urls>"],
    types: ["xmlhttprequest"],
  },
  ["requestHeaders", "blocking"]
);
