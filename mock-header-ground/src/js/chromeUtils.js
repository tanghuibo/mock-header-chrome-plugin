let data = {};
let funcMap = {};
/* global chrome */
if(chrome && chrome.extension && chrome.extension.onRequest) {
    chrome.extension.onRequest.addListener(request => {
        let func = funcMap[request.type];
        if(func) {
            func(request.message);
        }
    });
}

export default {
    setData(key, value) {
        let data = new Map();
        data[key] = value;
        return new Promise((resove) =>{
            /* global chrome */
            if(chrome && chrome.storage && chrome.storage.local) {
                chrome.storage.local.set(data, resove);
                this.sendMessage("refresh", null);
            } else {
                data[key] = value;
                resove(data);
            }
        });
    },

    getData(key) {
        return new Promise((resove) =>{
            /* global chrome */
            if(chrome && chrome.storage && chrome.storage.local) {
                chrome.storage.local.get(key, data => resove(data[key]));
            } else {
                resove(data[key]);
            }
        });
    },

    addChromeListen(type, func) {
        funcMap[type] = func;
    },

    sendMessage(type, message) {
        chrome.extension.sendRequest({type, message});
    }
}