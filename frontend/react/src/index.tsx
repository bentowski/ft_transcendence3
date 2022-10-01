import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);
root.render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
    <App />
    {/* </React.StrictMode> */}
  </BrowserRouter>
);

serviceWorker.unregister();
