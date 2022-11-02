import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {AuthProvider} from "./contexts/AuthProviderContext";
import {BrowserRouter, Routes, Route, HashRouter} from "react-router-dom";
//import {AuthProvider} from "./contexts/AuthProviderContext";
//import { AuthProvider } from 'react-auth-kit';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <AuthProvider>
            <Routes>
                <Route path="/*" element={<App />} />
            </Routes>
        </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>
);

//
//

serviceWorker.unregister();
