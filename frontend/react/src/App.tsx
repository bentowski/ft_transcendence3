import { Component } from "react";
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

const RequireAuth = () => {
  let { isAuth, isToken, isTwoFa, loading } = useAuthData();
  const location = useLocation();

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (isToken) {
     console.log("user is logged in");
    if (isTwoFa && !isAuth) {
       console.log("but needs to do two fa");
      return <AskTwoFa />;
    }
    if (isAuth) {
       console.log("welcome buddy");
      return <Outlet />;
    }
  }
  console.log('go to login');
  return <Navigate to="/login" state={{ from: location }} replace />;
};

const Layout = () => {
  return (
    <main className="App">
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
          </Route>
          <Route path="/game" element={<Game />} />
          <Route path="/game/*" element={<Game />} />
        </Route>
      </Route>

      {/* catch all */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  ); //
}; //

class App extends Component {
  getCurrentUser = async () => {
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
  };

  componentDidMount = async () => {
    await this.getCurrentUser();
  };

  render() {
    return <ContextLoader />; // fin de return
  } // fin de render
} // fin de App

export default App;
