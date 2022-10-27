import { Component } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import "./styles/App.css";
import Game from "./pages/Game";
import Login from "./pages/Login";
import Profil from "./components/Profil";
import Tchat from "./components/Tchat";
import History from "./components/History";
import { BrowserRouter } from "react-router-dom";
import Page from "./pages/Page";
import { useAuthData } from "./contexts/AuthProviderContext";
import Request from "./components/utils/Requests";

const IsAuthenticated = ({ children }: { children: JSX.Element }) => {
  const { isAuth, loading } = useAuthData();

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (isAuth) {
    return (
      <div>
        <Navigate to="/" />
      </div>
    );
  }
  return <div>{children}</div>;
};

const RequireAuth = (/**/) => {
  let { isAuth, loading } = useAuthData();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (isAuth) {
    return (
      <div>
        <Outlet />
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

const ContextLoader = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <IsAuthenticated>
            <Login />
          </IsAuthenticated>
        }
      />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Page />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/chat" element={<Tchat />} />
        <Route path="/history" element={<History />} />
        <Route path="/game" element={<Game />} />
      </Route>
    </Routes>
  );
};

//

//<Route element={<RequireAuth />} >

class App extends Component {
  state = {
    user: undefined,
  };

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

  componentDidMount = async () => {
    let user = await this.getCurrentUser();
    if (user) {
      this.setState({ user: user });
    }
  };

  render() {
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
