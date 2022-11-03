import "../styles/pages/login.css";
import { useAuthData} from "../contexts/AuthProviderContext";
import { Navigate, useLocation } from "react-router-dom";
import AskTwoFa from "./AskTwoFa";

const Login = () => {

  const { isAuth, loading, isTwoFa, isToken } = useAuthData();
  // const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // const [user, setUser] = useState(null);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  //console.log("is token?", isToken);

  if (isToken) {
    //console.log("toktok");
    if (isTwoFa && !isAuth) {
      //console.log("but needs to do two fa");
      return <AskTwoFa />;
    }
    if (isAuth) {
      //console.log("super your authenticated!");
      return (
        <div>
          <Navigate to={from} state={{ from: location }} replace />
        </div>
      );
    }
  }
  return (
    <div className="Login">
      <a
        href="https://api.intra.42.fr/oauth/authorize?client_id=0ca73eb0dd76ab61dabb62b46c3a31885e924d813db06a480056b2080f9b0126&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fredirect&response_type=code"
        className="pt-5 pb-3 d-flex flex-row justify-content-center align-items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          fill="currentColor"
          className="bi bi-lock"
          viewBox="0 0 16 16"
        >
          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-unlock-fill"
            viewBox="0 0 16 16"
          >
            <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2z" />
          </svg>
        </svg>
      </a>
      <div className="Inf px-5 pb-3">
        <h2 className="d-flex flex-row justify-content-center align-items-center">
          Sign up with your{" "}
        </h2>
        <h2 className="d-flex flex-row justify-content-center align-items-center">
          <img
            className="Logo mx-2 pt-1"
            src="./logos/42-logo.svg"
            alt=""
          ></img>{" "}
          account
        </h2>
      </div>
      <a href="http://localhost:3000/auth/login">
        <button className="mb-2 mx-2">Sign in</button>
      </a>
    </div>
  ); //

}; //

export default Login;
