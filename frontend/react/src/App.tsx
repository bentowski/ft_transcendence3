import {Routes, Route, Outlet, Navigate, useLocation, useNavigate, NavigateFunction} from "react-router-dom";
import Game from "./pages/Game";
import Login from "./pages/Login";
import Profil from "./components/Profil";
import Tchat from "./components/Tchat";
import History from "./components/History";
import Page from "./pages/Page";
import { useAuthData } from "./contexts/AuthProviderContext";
import AskTwoFa from "./pages/AskTwoFa";
import "./styles/App.css";
import PageNotFound from "./pages/PageNotFound";
import {HandleError} from "./components/utils/HandleError";

const RequireAuth = () => {
  let { isAuth, isToken, isTwoFa, loading } = useAuthData();
  const location = useLocation();

  if (loading) {
    return <h1>A Few Moment Later...</h1>;
  }
  if (isToken) {
    if (isTwoFa && !isAuth) {
      return <AskTwoFa />;
    }
    if (isAuth) {
      return <Outlet />;
    }
  }
  return <Navigate to="/login" state={{ from: location }} replace />;
};

const Layout = () => {
  return (
    <main className="App">
      <HandleError />
      <Outlet />
    </main>
  );
};

const App = () => {
  const nav: NavigateFunction = useNavigate();
  const loc: any = useLocation();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public route (add unauthorized) */}
        <Route path="/login" element={<Login />} />

        {/* private route */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Page />}>
            <Route path="/tchat/" element={<Tchat />} >
              <Route path="/tchat/*" element={<Tchat />} />
            </Route>
            <Route path="/profil/" element={<Profil nav={nav} loc={loc} />}>
              <Route path="/profil/*" element={<Profil nav={nav} loc={loc} />} />
            </Route>
            <Route path="/history" element={<History />} />
            <Route path="/game/" element={<Game />} >
              <Route path="/game/*" element={<Game />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* catch all */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  ); //
}; //

export default App;
