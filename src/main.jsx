import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`)
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
