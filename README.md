# mock-header-chrome-plugin

修改 `xhr` header chrome插件

## 应用场景

浏览器发送 `ajax` 请求时，通过该插件为其增加请求头，服务端通过处理请求头鉴权(伪造用户登录)，方便端到端的测试（不需要来回登入登出切换用户身份）。
