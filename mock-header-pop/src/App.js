import React, { useState } from "react";
import { List, Avatar, Card, Input } from "antd";
import "./App.css";

const data = [
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
];

function App() {
  const [searchContent, setSearchContent] = useState("");
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
      </Card>
      <Card>
        <List
          itemLayout="horizontal"
          dataSource={data.filter((item) =>
            searchContent === null || searchContent === ""
              ? true
              : JSON.stringify(item).indexOf(searchContent) >= 0
          )}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar className="Avatar" size={48}>{item.username}</Avatar>}
                title={
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "1.3rem"
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
    </div>
  );
}

export default App;
