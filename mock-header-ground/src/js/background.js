

import chromeUtils from './chromeUtils';

let data = {};

async function refresh() {
  let mainSwitch = await chromeUtils.getData("mainSwitch");
  let userList = await chromeUtils.getData("userList");
  let selectUsername = await chromeUtils.getData("selectUsername");
  mainSwitch = mainSwitch === 'true';

  if (userList == null || userList == '') {
    userList = [];
  } else {
    userList = JSON.parse(userList);
  }

  let selectUser = null;

  for (const user of userList) {
    if (user.username === selectUsername && selectUsername != null) {
      selectUser = user;
      break;
    }
  }
  data = { mainSwitch, selectUser };
}

refresh();

chromeUtils.addChromeListen("refresh", refresh);

/* global chrome */
if (chrome && chrome.webRequest && chrome.webRequest.onBeforeSendHeaders) {
  chrome.webRequest.onBeforeSendHeaders.addListener(
    function (request) {
      let { mainSwitch, selectUser: {
        mockHeader
      } } = data;

      let requestHeaders = request.requestHeaders;

      if (mainSwitch && mockHeader != null) {
        requestHeaders.push({
          name: "mock-test",
          value: JSON.stringify(mockHeader),
        });
      }

      return { requestHeaders };
    },
    {
      urls: ["<all_urls>"],
      types: ["xmlhttprequest"],
    },
    ["requestHeaders", "blocking"]
  );

}
