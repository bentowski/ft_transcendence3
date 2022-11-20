import "../styles/pages/login.css";
import { useAuthData } from "../contexts/AuthProviderContext";
import { Navigate, useLocation } from "react-router-dom";
import AskTwoFa from "./AskTwoFa";
import {useEffect, useState} from "react";

const Login = () => {
  const { isAuth, loading, isTwoFa, isToken } = useAuthData();
  // const navigate = useNavigate();
  //const [isLogged, setIsLogged] = useState(false);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // const [user, setUser] = useState(null);

  if (loading) {
    return <h1>A Few Moment Later...</h1>;
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
  //console.log('here is login page');
  return (
	<div>
		<map name="spongebobbg">
			<area
				shape="poly"
				coords="187,231,139,266,115,319,114,339,109,354,108,385,108,434,117,478,149,492,160,493,170,494,193,498,215,498,271,499,303,490,316,482,327,461,336,413,336,374,332,341,320,300,352,298,357,287,355,277,352,267,357,243,362,231,357,225,335,229,336,245,337,280,324,284,322,287,315,288,307,266,298,254,286,239,277,237,267,230,235,223,208,225"
				href="http://localhost:3000/auth/login"/>
		</map>
		<div id="background-wrap">
			{/* delete below before push */}
			<a href="http://localhost:3000/auth/dummyconnect">
				<button className="mb-2 mx-2">Letssss go</button>
			</a>
			{/* delete above before push */}
			<div>
				<img useMap="#spongebobbg" src="http://localhost:8080/pictures/bobhouse.png" width="auto" style={{position: "absolute", top: 0, bottom: 0, right: 0, left: 0, margin: "auto"}}/>
			</div>
			<div className="d-flex justify-content-center h-25 ">
				<div className="bubble x-static align-self-center d-flex align-items-center justify-content-center"><p className="text-center">Knock Bob's<br/>house to login</p></div>
			</div>
			{/* div below for animation */}
			<div className="bubble x1"></div>
    		<div className="bubble x2"></div>
    		<div className="bubble x3"></div>
    		<div className="bubble x4"></div>
    		<div className="bubble x5"></div>
    		<div className="bubble x6"></div>
    		<div className="bubble x7"></div>
    		<div className="bubble x8"></div>
    		<div className="bubble x9"></div>
    		<div className="bubble x10"></div>
		</div>
	</div>
  ); //
}; //
//
export default Login;
