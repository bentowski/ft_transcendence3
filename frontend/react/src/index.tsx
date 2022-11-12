import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {AuthProvider} from "./contexts/AuthProviderContext";
import {BrowserRouter, Routes, Route } from "react-router-dom";

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
