import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';  
import 'codemirror/theme/eclipse.css';



ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
