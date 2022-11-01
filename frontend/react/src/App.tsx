import React, {Component, useEffect, useState} from "react";
import {Routes, Route, Outlet, Navigate, useLocation} from "react-router-dom";
import "./styles/App.css";
import Game from "./pages/Game";
import Login from "./pages/Login";
import Profil from "./components/Profil";
import Tchat from "./components/Tchat";
import History from "./components/History";
import { BrowserRouter } from "react-router-dom";
import Page from "./pages/Page";
import {AuthContext, useAuthData} from "./contexts/AuthProviderContext";
import Request from "./components/utils/Requests";
import PageNotFound from "./pages/PageNotFound";
import AskTwoFa from './components/utils/AskTwoFa';

/*
const IsAuthenticated = ({ children }: { children: JSX.Element }) => {

};
*/

const RequireAuth = ( /*{ children }:{ children: JSX.Element }*/) => {
//const RequireAuth = ({children}:{children: JSX.Element}) => {
  let { isAuth, isLogin, isTwoFa, loading } = useAuthData();
  const location = useLocation();
  //let isAuth: any = sessionStorage.getItem("isAuth");
  console.log('ISAUTH=',isAuth);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  //console.log('requireauth user is login?')
  /*
  if (isLogin) {

    //console.log('user is logged in');
    if (isTwoFa && !isAuth) {
      //console.log('but needs to do two fa');
      return

          <AskTwoFa />

    }
  }
  */
  console.log('is auth = ', isAuth);

  if (isAuth) {
    return (
       /* children ?
            children : */
        <Outlet />
    );
  }
  return <Navigate to="/login" state={{ from: location }} replace />;
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

const PersistLogin = () => {
  const [loading, setIsLoading] = useState(true);
  const { isAuth, isToken } = useAuthData();

  useEffect(() => {
    const checkToken = async () => {
      try {
        fetch("http://localhost:3000/auth/istoken", {
              method: "GET",
              credentials: "include",
            }
        )
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (!isAuth) {
      checkToken();
    } else {
      setIsLoading(false);
    }
  }, [])

  return (
     <>
     {loading ?
         <p>loading...</p>
         : <Outlet />
     }
     </>
  )
}

const ContextLoader = () => {
  /*
  const [loggedIn, setLoggedIn] = useState(false);
  const { isAuth } = useAuthData();
  const history = useHistory();

  useEffect(() => {
    if (isAuth) {
      history.push('/');
      setLoggedIn(true);
    }
  }, [isAuth]);

   */

  //console.log('loggedin = ', loggedIn);
  //useEffect(() => {
    //setLoggedIn(true);
  //}, [])

  //

  return (
    <Routes>
      <Route path="/" element={<Layout />} >
          {/* public route (add unauthorized) */}
          <Route path="/login" element={<Login />} />

          {/* private route */}
        <Route element={<PersistLogin />} >
          <Route element={<RequireAuth />} >
              <Route path="/" element={<Page />} >
                <Route path="/profil" element={<Profil />} />
                <Route path="/tchat" element={<Tchat />} />
                <Route path="/history" element={<History />} />
                <Route path="/game" element={<Game />} />
                <Route path="/*" element={<Profil />} />
                <Route path="/" element={<Profil />} />
              </Route>
          </Route>
          </Route>

        {/* catch all */}
      </Route>
    </Routes>
  ); //
  //<Route path="*" element={<PageNotFound />} />
};//        </Route>

//<Route path="/" element={<RequireAuth><Page /></RequireAuth>} >

//

//<Route element={<RequireAuth />} >

class App extends Component {
  static contextType = AuthContext;

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
    //let ctx: any = this.context;
    //let usr: any = ctx.user;
    //let isa: boolean = usr.isAuth;
    //console.log('isa = ', isa);
    const data = {
      user: {
        auth_id: user.auth_id,
        user_id: user.user_id,
        avatar: "https://avatars.dicebear.com/api/personas/" + 36 + ".svg",
        username: user.username,
      },
      //isAuth: isa,
    };
    sessionStorage.setItem("data", JSON.stringify(data));
  };





  componentDidMount = async () => {

   await this.getCurrentUser();

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
