import {useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {useAuthData} from "../contexts/AuthProviderContext";
import {Alert} from "react-bootstrap";
import IError from "../interfaces/error-interface";
//import Request from '../components/utils/Requests';
// import { useAuthData } from "../contexts/AuthProviderContext";

const AskTwoFa = () => {
  // const { isAuth, isTwoFa, isToken, loading } = useAuthData();
  const { user, updateUserList, userAuthentication, isAuth, loading, isToken, isTwoFa} = useAuthData();
  const [code, setCode] = useState("");
  const [validate, setValidate] = useState(false);
  // const location = useLocation();
  //const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  // const from = location.state?.from?.pathname || "/";

  const validateTwoFa = async () => {
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
        userAuthentication(true);
      } else {
        const errmsg: IError = await res.json();
        setAlert(true);
        setAlertMsg(errmsg.message);
      }
  };

  useEffect(() => {
    if (isAuth) {
      setValidate(true);
    }
  }, [isAuth]);

    const closeAlert = () => {
        setAlert(false);
        setAlertMsg("");
    }

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setCode(evt.target.value);
  };

  if (alert) {
      return (<Alert onClose={closeAlert} variant='warning' dismissible>{alertMsg}</Alert>);
  }

  //console.log('before is loading');
  if (loading) {
    return <p>A Few Moment Later...</p>;
  }
  //console.log('checking if token');
  if (isToken) {
    //console.log('token ok, checking if needs twofa');
    if (isTwoFa && !isAuth) {
      //console.log('needs 2 fa before connect');
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
    //console.log('doesing need two fa, checking if auth')
    if (validate) {
      //console.log('logging ok');
        updateUserList(user, true);
      return (<Navigate to="/" />);
    }
  }
  //console.log('doesnt need two fa and isnt auth')
  return (<Navigate to="/login" />);
};

export default AskTwoFa;
//   <AuthContext.Consumer>
//                     {({ login }) => {
// }}
// </AuthContext.Consumer>
