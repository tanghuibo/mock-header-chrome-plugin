import React, { useState, useEffect, useRef } from "react";
import { Button, message } from "antd";
import CodeMirror from "react-codemirror";
import chromeUtils from './js/chromeUtils';
import './js/background';
import "./App.css";

function App() {
  const codemirror = useRef(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * 获取数据
   */
  async function getUserList() {
    let userList = await chromeUtils.getData("userList");
    if (userList == null || userList === '') {
      return;
    }
    setCode(userList);
    codemirror.current.codeMirror.setValue(userList);
  }

  /**
   * 设置数据
   * @param {*} userList 
   */
  async function setUserList(userList) {
    await chromeUtils.setData("userList", userList);
  }

  function refresh() {
    getUserList();
  }

  useEffect(() => {
    refresh();
  }, []);


  async function onSubmit() {
    try {
      setLoading(true);
      let result = JSON.parse(code);
      if (!(result instanceof Array)) {
        throw new Error("不为数据");
      }
      await setUserList(code);
      setLoading(false);
      message.success("修改成功")
    } catch (e) {
      console.error(e);
      message.error("格式错误:" + e);
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <div
        style={{
          border: "1px solid #f0f0f0",
        }}
      >
        <CodeMirror
          ref={codemirror}
          onChange={setCode}
          value={code}
          className="my-code-mirror"
          options={{
            width: "100vw",
            height: "100vh",
            mode: "javascript",
            theme: "eclipse",
            lineNumbers: true,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 10,
        }}
      >
        <Button type="primary" onClick={onSubmit} loading={loading}>
          更新
        </Button>
      </div>
    </div>
  );
}

export default App;
