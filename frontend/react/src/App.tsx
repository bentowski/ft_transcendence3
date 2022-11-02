import { Component } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import "./styles/App.css";
import Game from "./pages/Game";
import Login from "./pages/Login";
import Profil from "./components/Profil";
import Tchat from "./components/Tchat";
import History from "./components/History";
import { BrowserRouter, useLocation } from "react-router-dom";
import Page from "./pages/Page";
import { AuthContext, useAuthData } from "./contexts/AuthProviderContext";
import Request from "./components/utils/Requests";
import PageNotFound from "./pages/PageNotFound";


const RequireAuth = () => {
  let { isAuth, loading } = useAuthData();
  const location = useLocation();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (isAuth) {
    return (
        <Outlet />
    );
  } else {
    return <Navigate to="/login"  state={{ from: location }} replace />;
  }
};
//
//<IsAuthenticated>
//</IsAuthenticated>
//</Route>

const Layout = () => {
  return (
      <main className="App">
        <Outlet />
      </main>
  )
}

const ContextLoader = () => {
  return (
      <Routes>
        <Route path="/" element={<Layout />} >
          {/* public route (add unauthorized) */}
          <Route path="/login" element={<Login />} />

          {/* private route */}

          <Route element={<RequireAuth />} >
            <Route path="/" element={<Page />} >
              <Route path="/profil" element={<Profil />} />
              <Route path="/tchat" element={<Tchat />} />
              <Route path="/history" element={<History />} />
              <Route path="/game" element={<Game />} />

            </Route>
          </Route>
        </Route>

        {/* catch all */}

      </Routes>
  );
};

//   <Route path="/*" element={<Profil />} />
//               <Route path="*" element={<Profil />} />

//<Route element={<RequireAuth />} >

class App extends Component {
  //static contextType = AuthContext;

  /*
  constructor(props: any) {
    super(props);
    this.state = { user: undefined, isAuth: false, loading: false };
  }

   */


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

        <ContextLoader />

    ); // fin de return
  } // fin de render
} // fin de App
//
//

export default App;
