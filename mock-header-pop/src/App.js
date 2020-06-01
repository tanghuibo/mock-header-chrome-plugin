import React, { useState, useRef } from "react";
import { List, Avatar, Card, Input, Radio, Button, Switch } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import DownloadDialog from "./components/DownloadDialog";
import UploadDialog from "./components/UploadDialog";

import "./App.css";

function App() {
  const [searchContent, setSearchContent] = useState(null);
  const [mainSwatch, setMainSwatch] = useState(false);
  const [selectUsername, setSelectUsername] = useState(false);
  const downloadDialog = useRef(null);
  const uploadDialog = useRef(null);
  const [data, setData] = useState([
    {
      username: "张三",
      desc: "会开锁",
    },
    {
      username: "李四",
      desc: "会IT",
    },
    {
      username: "王五",
      desc: "会武功",
    },
  ]);
  function uploadData(data, isOk) {
    setTimeout(() => {
      setData(data);
      isOk(true);
    }, 2000);
  }
  function changeSelectUser(checked, username) {
    if (!checked) {
      setSelectUsername(null);
    } else {
      setSelectUsername(username);
    }
  }
  return (
    <div className="App">
      <DownloadDialog ref={downloadDialog} />
      <UploadDialog ref={uploadDialog} onSubmit={uploadData} />
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
        <Switch
          checkedChildren="开启"
          unCheckedChildren="关闭"
          checked={mainSwatch}
          onChange={setMainSwatch}
          className="all-swatch"
        />
      </Card>
      {mainSwatch ? (
        <Card
          actions={[
            <Button
              type="link"
              icon={
                <UploadOutlined
                  onClick={() => {
                    uploadDialog.current.show(JSON.stringify(data, 0, 2));
                  }}
                  style={{
                    fontSize: "2rem",
                  }}
                />
              }
            ></Button>,
            <Button
              onClick={() => {
                downloadDialog.current.show(JSON.stringify(data, 0, 2));
              }}
              type="link"
              icon={
                <DownloadOutlined
                  style={{
                    fontSize: "2rem",
                  }}
                />
              }
            ></Button>,
          ]}
        >
          <div
            style={{
              maxHeight: "60vh",
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={data.filter((item) =>
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
          </div>
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
