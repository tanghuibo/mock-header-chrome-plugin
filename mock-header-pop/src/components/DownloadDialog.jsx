import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Modal } from "antd";
import CodeMirror from 'react-codemirror';  

export default forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  function show() {
    setVisible(true);
  }
  useImperativeHandle(ref, () => ({
    show,
  }));
  return (
    <Modal visible={visible} onCancel={() => setVisible(false)} footer={null} title="导出">
      <div style={{
        border: "1px solid #f0f0f0"
      }}>
        <CodeMirror
          value='[1,2, {"a": 2}]'
          options={{
            readOnly: true,
            mode: "javascript",
            theme: "eclipse",
            lineNumbers: true,
          }}
        />
      </div>
    </Modal>
  );
});
