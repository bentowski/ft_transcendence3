import React, { Component } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import "./styles/App.css";
import Game from "./pages/Game";
import Login from "./pages/Login";
import Profil from "./components/Profil";
import Tchat from "./components/Tchat";
import History from "./components/History";
import { BrowserRouter } from "react-router-dom";
import Page from "./pages/Page";
import {useAuthData } from "./contexts/AuthProviderContext";
import Request from "./components/utils/Requests";
import PageNotFound from "./pages/PageNotFound";
import AskTwoFa from './components/utils/AskTwoFa';

const IsAuthenticated = ({ children }: { children: JSX.Element }) => {
  const { isAuth, loading, isTwoFa, isToken } = useAuthData();

  if (loading) {
    return <h1>Loading...</h1>;
  }
  console.log('is token?', isToken);
  if (isToken) {
    console.log('no toktok');
    if (isTwoFa) {
      console.log('but needs to do two fa');
      return (
          <AskTwoFa />
      )
    }
    if (isAuth) {
      console.log('user authenticated!');
      return (
          <div>
            <Navigate to="/" />
          </div>
      );
    }
  }
  return <div>{children}</div>;
};

const RequireAuth = ({children}:{children: any}) => {
  let { isLogin, isTwoFa, isAuth, loading } = useAuthData();

  if (loading) {
    return <h1>Loading...</h1>;
  }
  console.log('requireauth user is login?')
  if (isLogin) {
    console.log('user is logged in');
    if (isTwoFa) {
      console.log('but needs to do two fa');
      return (
          <AskTwoFa/>
      )
    }
  }
  if (isAuth) {
    return (
        children ?
            children :
      <div>
        <Outlet />
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

//
//<IsAuthenticated>
//</IsAuthenticated>
//</Route>

const ContextLoader = () => {
  return (
    <Routes>
      <Route path="/login" element={<IsAuthenticated><Login /></IsAuthenticated>} />
        <Route path="/" element={<RequireAuth><Page /></RequireAuth>} >
          <Route path="profil" element={<RequireAuth><Profil /></RequireAuth>} />
          <Route path="chat" element={<RequireAuth><Tchat /></RequireAuth>} />
          <Route path="history" element={<RequireAuth><History /></RequireAuth>} />
          <Route path="game" element={<RequireAuth><Game /></RequireAuth>} />
          <Route path="*" element={<RequireAuth><PageNotFound /></RequireAuth>} />
        </Route>
    </Routes>
  );
};

//

//<Route element={<RequireAuth />} >

class App extends Component {
  //static contextType = AuthContext;

  /*
  constructor(props: any) {
    super(props);
    this.state = { user: undefined, isAuth: false, loading: false };
  }

   */
  /*

  getCurrentUser = async () => {
    let user = await Request(
      "GET",
      {},
      {},
      "http://localhost:3000/user/current"
    );
    if (!user) {
      return null;
    }
    const data = {
      user: {
        auth_id: user.auth_id,
        user_id: user.user_id,
        avatar: "https://avatars.dicebear.com/api/personas/" + 36 + ".svg",
        username: user.username,
      },
    };
    sessionStorage.setItem("data", JSON.stringify(data));
    return user;
  };



   */

  componentDidMount = async () => {

  //  await this.getCurrentUser();

    /*
    if (user) {
      this.setState({ user: user });
    }

     */
  };

  render() {
    window.addEventListener("popstate", (event) => {
      let url = document.URL;
      if (url === "http:localhost:8080")
        console.log("test")
    });
    return (
      <BrowserRouter>
        <ContextLoader />
      </BrowserRouter>
    ); // fin de return
  } // fin de render
} // fin de App
//
//

export default App;
