import React, { useContext } from "react";
import { Routes, Route, Router } from "react-router-dom";
import "./styles/App.css";
import Game from "./pages/Game";
import Page from "./pages/Page";
import Login from "./pages/Login";
import Profil from "./components/Profil";
import Tchat from "./components/Tchat";

class App extends React.Component {
  state = {};

  render() {
    const data = {
      user: {
        auth_id: 56381,
        user_id: 3,
        avatar: "https://avatars.dicebear.com/api/personas/123.svg",
        username: "toto",
      },
    };
    sessionStorage.setItem("data", JSON.stringify(data));
    return (
      <Routes>
        <Route path="/" element={<Page />}>
          <Route path="/profil" element={<Profil />} />
          <Route path="/tchat" element={<Tchat />} />
          <Route path="/*" element={<Profil />} />
          <Route path="/" element={<Profil />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    ); // fin de return
  } // fin de render
} // fin de App

export default App;
