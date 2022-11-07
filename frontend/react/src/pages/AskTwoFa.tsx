import {useEffect, useState} from "react";
// import { useAuthData } from "../contexts/AuthProviderContext";
import {Navigate, useNavigate} from "react-router-dom";
import {useAuthData} from "../contexts/AuthProviderContext";
//import Request from '../components/utils/Requests';

const AskTwoFa = () => {
  // const { isAuth, isTwoFa, isToken, loading } = useAuthData();
  const { setIsAuth, isAuth, loading, isToken, isTwoFa} = useAuthData();
  const [code, setCode] = useState("");
  const [validate, setValidate] = useState(false);
  // const location = useLocation();
  const navigate = useNavigate();
  // const from = location.state?.from?.pathname || "/";

  const validateTwoFa = async () => {
    console.log("code = ", code);
    try {
      let res = await fetch("http://localhost:3000/auth/2fa/authenticate",
          {
            method: "POST",
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({twoFACode: code})
          })
      if (res.ok) {
        window.location.reload();
      } else {
        console.log('request failed');
      }
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        console.log("oulala -", error);
      } else {
        console.log("unexpected error ", error);
      }
    }
  };

  /*
  useEffect(() => {
    if (isAuth) {
      setValidate(true);
    }
  });
   */

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setCode(evt.target.value);
  };

  console.log('before is loading');
  if (loading) {
    return <p>Loading...</p>;
  }
  console.log('checking if token');
  if (isToken) {
    console.log('token ok, checking if needs twofa');
    if (isTwoFa && !isAuth) {
      console.log('needs 2 fa before connect');
      return (
          <div>
            <form className="mb-3">
              <input
                  type="text"
                  placeholder="2fa activation code"
                  maxLength={6}
                  id="code"
                  name="code"
                  onChange={handleChange}
                  value={code}
              />
            </form>

            <button onClick={validateTwoFa} className="mx-1">
              Validate
            </button>
          </div>
      );
    }
    console.log('doesing need two fa, checking if auth')
    if (isAuth) {
      console.log('logging ok');
      return (<Navigate to="/" />);
    }
  }
  console.log('doesnt need two fa and isnt auth')
  return (<Navigate to="/login" />);
};

export default AskTwoFa;
//   <AuthContext.Consumer>
//                     {({ login }) => {
// }}
// </AuthContext.Consumer>
