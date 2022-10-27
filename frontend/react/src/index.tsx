import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {AuthProvider} from "./contexts/AuthProviderContext";
//import {BrowserRouter} from "react-router-dom";
//import {AuthProvider} from "./contexts/AuthProviderContext";
//import { AuthProvider } from 'react-auth-kit';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);
root.render(
  <React.StrictMode>
      <AuthProvider>
         <App />
      </AuthProvider>
  </React.StrictMode>
);

serviceWorker.unregister();
