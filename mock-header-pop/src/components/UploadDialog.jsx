import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Modal, Button, message } from "antd";
import CodeMirror from "react-codemirror";

export default forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [code, setCode] = useState("");
  function show(code) {
    setVisible(true);
    setCode(code);
  }

  function onSubmit() {
    try {
      let result = JSON.parse(code);
      if(!(result instanceof Array)) {
        throw new Error("不为数据");
      }
      props.onSubmit(result);
      setVisible(false);
    } catch (e) {
      console.error(e);
      message.error("格式错误:" + e);
      
    }
  }
  useImperativeHandle(ref, () => ({
    show,
  }));
  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      title="导入"
    >
      <div
        style={{
          border: "1px solid #f0f0f0",
        }}
      >
        <CodeMirror
          onChange={setCode}
          value={code}
          options={{
            mode: "javascript",
            theme: "eclipse",
            lineNumbers: true,
          }}
        />
      </div>

      <div style={{
          marginTop: 10
      }}>
        <Button type="primary" onClick={onSubmit}>导入</Button>
      </div>
    </Modal>
  );
});
