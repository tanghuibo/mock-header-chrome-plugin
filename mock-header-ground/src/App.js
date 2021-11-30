import React, { useState, useEffect, useRef } from "react";
import { Button, message, Input, Tag } from "antd";
import CodeMirror from "react-codemirror";
import chromeUtils from "./js/chromeUtils";
import "./App.css";

function App() {
  const codemirror = useRef(null);
  const [userList, setUserList] = useState("");
  const [urlList, setUrlList] = useState("");
  const [backUrlList, setBackUrlList] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * 获取数据
   */
  async function getUserList() {
    let userList = await chromeUtils.getData("userList");
    if (userList == null || userList === "") {
      return;
    }
    setUserList(userList);
    codemirror.current.codeMirror.setValue(
      typeof(userList) === "string" ? userList : JSON.stringify(userList)
    );
  }


  async function getUrlList() {
    let urlList = await chromeUtils.getData("urlList");
    if (urlList == null || urlList === "") {
      return;
    }
    setUrlList(urlList);
  }

  async function getBackUrlList() {
    let backUrlList = await chromeUtils.getData("backUrlList");
    if (backUrlList == null || backUrlList === "") {
      return;
    }
    setBackUrlList(backUrlList);
  }

  function refresh() {
    getUserList();
    getUrlList();
    getBackUrlList();
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onSubmit() {
    try {
      setLoading(true);
      let result = JSON.parse(userList);
      if (!(result instanceof Array)) {
        throw new Error("不为数据");
      }
      await chromeUtils.setData("userList", userList);
      await chromeUtils.setData("urlList", urlList);
      await chromeUtils.setData("backUrlList", backUrlList);
      setLoading(false);
      message.success("修改成功");
    } catch (e) {
      console.error(e);
      message.error("格式错误:" + e);
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <div>
        <Tag color="processing" style={{ width: "80px", textAlign: "center" }}>
          URL
        </Tag>
      </div>
      <div>
        <Input.TextArea
          value={urlList}
          onChange={(value) => setUrlList(value.target.value)}
          style={{ width: "100vw" }}
          placeholder="url与当前值前缀匹配时生效，多个可以换行隔开"
        ></Input.TextArea>
      </div>

      <div>
        <Tag color="processing" style={{ marginTop: "10px", width: "80px", textAlign: "center" }}>
          BACK URL
        </Tag>
      </div>
      <div>
        <Input.TextArea
          value={backUrlList}
          onChange={(value) => setBackUrlList(value.target.value)}
          style={{ width: "100vw" }}
          placeholder="url与当前值前缀匹配时生效，多个可以换行隔开"
        ></Input.TextArea>
      </div>

      <div style={{ marginTop: "10px" }}>
        <div>
          <Tag
            color="processing"
            style={{ width: "80px", textAlign: "center" }}
          >
            用户信息
          </Tag>
        </div>
        <div
          style={{
            border: "1px solid #f0f0f0",
          }}
        >
          <CodeMirror
            ref={codemirror}
            onChange={setUserList}
            value={userList}
            className="my-code-mirror"
            options={{
              width: "100vw",
              mode: "javascript",
              theme: "eclipse",
              lineNumbers: true,
            }}
          />
        </div>
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
