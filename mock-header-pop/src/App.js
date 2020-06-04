import React, { useState, useEffect } from "react";
import { List, Avatar, Card, Input, Radio, Button, Switch } from "antd";
import { FormOutlined } from "@ant-design/icons";
import chromeUtils from './js/chromeUtils';

import "./App.css";

function App() {
  const [searchContent, setSearchContent] = useState(null);
  const [mainSwitch, setMainSwitch] = useState(false);
  const [selectUsername, setSelectUsername] = useState(false);
  const [userList, setUserList] = useState([]);

  async function getUserList() {
    let code = await chromeUtils.getData("userList");
    if (code == null || code === '') {
      setUserList([]);
    } else {
      setUserList(JSON.parse(code));
    }
  }

  async function getMainSwitch() {
    let code = await chromeUtils.getData("mainSwitch");
    if (code == 'true') {
      setMainSwitch(true);
    } else {
      setMainSwitch(false);
    }
  }

  async function getSelectUsername() {
    let code = await chromeUtils.getData("selectUsername");
    setSelectUsername(code);
  }

  function refresh() {
    getUserList();
    getMainSwitch();
    getSelectUsername();
  }

  function openBackGround() {
    /* global chrome */
    window.open(chrome.extension.getBackgroundPage().location.href);
  }

  function changeSelectUser(checked, username) {
    if (!checked) {
      setSelectUsername(null);
    } else {
      chromeUtils.setData("selectUsername", username);
      setSelectUsername(username);
    }
  }

  function changeMainSwitch(sw) {
    chromeUtils.setData("mainSwitch", sw ? "true" : "false");
    setMainSwitch(sw);
  }

  useEffect(() => {
    refresh();
    chromeUtils.addChromeListen("refresh", refresh);
  }, []);



  return (
    <div className="App">
      <Card
        style={{
          textAlign: "center",
        }}
      >
        <Input.Search
          value={searchContent}
          onChange={({ target: { value } }) => setSearchContent(value)}
          style={{ width: "90%" }}
        />
        <div className="mainSwitchDiv"><Switch
          checkedChildren="开启"
          unCheckedChildren="关闭"
          checked={mainSwitch}
          onChange={changeMainSwitch}
          className="all-Switch"
        /></div>
      </Card>
      {mainSwitch ? (
        <Card
          actions={[
            <Button
              type="link"
              icon={
                <FormOutlined
                  onClick={() => {
                    openBackGround();
                  }}
                  style={{
                    fontSize: "2rem",
                  }}
                />
              }
            ></Button>,
          ]}
        >
          <List
            style={{
              maxHeight: "60vh",
              overflowY: "scroll"
            }}
            itemLayout="horizontal"
            dataSource={userList.filter((item) =>
              searchContent === null || searchContent === ""
                ? true
                : JSON.stringify(item).indexOf(searchContent) >= 0
            )}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Radio
                    checked={selectUsername === item.username}
                    onChange={(checked) =>
                      changeSelectUser(checked, item.username)
                    }
                  >
                    启用
                    </Radio>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar className="Avatar" size={48}>
                      {item.username}
                    </Avatar>
                  }
                  title={
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1.3rem",
                      }}
                    >
                      {item.username}
                    </div>
                  }
                  description={item.desc}
                />
              </List.Item>
            )}
          />
        </Card>
      ) : (
          <Card>
            <div style={{ textAlign: "center" }}>插件已关闭</div>
          </Card>
        )}
    </div>
  );
}

export default App;
