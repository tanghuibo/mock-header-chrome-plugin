let funcMap = {};
/* global chrome */
chrome.extension.onRequest.addListener(request => {
  let func = funcMap[request.type];
  if(func) {
      func(request.message);
  }
});

const chromeUtils = {
  setData(key, value) {
    let data = new Map();
    data[key] = value;
    return new Promise((resove) => {
      /* global chrome */
      chrome.storage.local.set(data, resove);
      this.sendMessage("refresh", null);
    });
  },

  getData(key) {
    return new Promise((resove) => {
      /* global chrome */
      chrome.storage.local.get(key, (data) => resove(data[key]));
    });
  },

  addChromeListen(type, func) {
    funcMap[type] = func;
  }
};

let data = {};

async function refresh() {
  let mainSwitch = await chromeUtils.getData("mainSwitch");
  let userList = await chromeUtils.getData("userList");
  let urlList = await chromeUtils.getData("urlList");
  let selectUsername = await chromeUtils.getData("selectUsername");
  mainSwitch = mainSwitch === "true";

  if (userList == null || userList == "") {
    userList = [];
  } else {
    userList = JSON.parse(userList);
  }

  if(urlList != null || urlList instanceof String) {
    urlList = urlList.split("\n");
  } else {
    urlList = null;
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

function isPass(urlList, url) {
  for (const urla of urlList) {
    if(url.startsWith(urla)) {
      return true;
    }
  }
  return false;
}

refresh();

chromeUtils.addChromeListen("refresh", refresh);

/* global chrome */
if (chrome && chrome.webRequest && chrome.webRequest.onBeforeSendHeaders) {
  chrome.webRequest.onBeforeSendHeaders.addListener(
    function (request) {
      let {
        mainSwitch,
        selectUser,
      } = data;

      let headers = selectUser == null ? null : selectUser.headers;

      let requestHeaders = request.requestHeaders;

      if (mainSwitch && headers != null && isPass(urlList, request.url)) {
        Object.keys(headers).forEach((name) => {
          let value = headers[name];
          requestHeaders.push({
            name,
            value:
              value instanceof String ? value : JSON.stringify(headers[name]),
          });
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
