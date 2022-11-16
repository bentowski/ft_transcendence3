import {Component, useEffect, useState} from "react";
import { Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import Game from "./pages/Game";
import Login from "./pages/Login";
import Profil from "./components/Profil";
import Tchat from "./components/Tchat";
import History from "./components/History";
import Page from "./pages/Page";
import { useAuthData } from "./contexts/AuthProviderContext";
import Request from "./components/utils/Requests";
import AskTwoFa from "./pages/AskTwoFa";
import "./styles/App.css";
import PageNotFound from "./pages/PageNotFound";
import {HandleError} from "./components/utils/HandleError";
//import {Alert} from "react-bootstrap";
//import {Alert} from 'react-bootstrap';
//import {useError} from "./contexts/ErrorProviderContext";
//import {HandleError} from "./components/utils/HandleError";
//import IError from "./interfaces/error-interface";

const RequireAuth = () => {
  let { isAuth, isToken, isTwoFa, loading } = useAuthData();
  //const [validate, setValidate] = useState(false);
  const location = useLocation();

  /*
  useEffect(() => {
    if (isAuth) {
      setValidate(true);
    }
  }, [isAuth]);
   */

  if (loading) {
    return <h1>A Few Moment Later...</h1>;
  }
  if (isToken) {
     //console.log("user is logged in");
    if (isTwoFa && !isAuth) {
       //console.log("but needs to do two fa");
      return <AskTwoFa />;
    }
    if (isAuth) {
       //console.log("welcome buddy");
      return <Outlet />;
    }
  }
  //console.log('go to login');
  return <Navigate to="/login" state={{ from: location }} replace />;
};

const Layout = () => {
  //const { errorMsg, errorShow} = useErrorContext();
  //const [show, setShow] = useState(false);

  //useEffect(() => {
    //if (errorShow) {
      //setShow(true);
    //}
  //})
  //<Alert show={errorShow} variant="warning" dismissible>{errorMsg}</Alert>

  return (
    <main className="App">
      <HandleError />
      <Outlet />
    </main>
  );
};

const ContextLoader = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public route (add unauthorized) */}
        <Route path="/login" element={<Login />} />

        {/* private route */}

        <Route element={<RequireAuth />}>
          <Route path="/" element={<Page />}>
            <Route path="/tchat" element={<Tchat />} />
            <Route path="/tchat/*" element={<Tchat />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/profil/*" element={<Profil />} />
            <Route path="/history" element={<History />} />
            <Route path="/game" element={<Game />} />
            <Route path="/game/*" element={<Game />} />
          </Route>
        </Route>
      </Route>

      {/* catch all */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  ); //
}; //

class App extends Component {

  getCurrentUser = async () => {
    try {
      let user = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/user/current"
      );
      if (!user)
        return null;
      const data = {
        user: {
          auth_id: user.auth_id,
          user_id: user.user_id,
          avatar: "https://avatars.dicebear.com/api/personas/" + 36 + ".svg",
          username: user.username,
        },
      };
      sessionStorage.setItem("data", JSON.stringify(data));
    } catch (error) {
      //console.log('error catchouillle');
      //const ctx: any = this.context;
      //ctx.setError(error);
      console.log(error);
    }
  };

  componentDidMount = async () => {
    await this.getCurrentUser();
  }

  render(){
    return (
        <ContextLoader />
    );
  }
}

export default App;
