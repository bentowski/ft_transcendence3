import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {useAuthData} from "../contexts/AuthProviderContext";

const AskTwoFa = () => {
  const { user, updateUserList, userAuthentication, isAuth, loading, isToken, isTwoFa} = useAuthData();
  const [code, setCode] = useState("");
  const [validate, setValidate] = useState(false);

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
          //seterror
      }
  };

  useEffect(() => {
    if (isAuth) {
      setValidate(true);
    }
  }, [isAuth]);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setCode(evt.target.value);
  };

  if (loading) {
    return <p>A Few Moment Later...</p>;
  }
  if (isToken) {
    if (isTwoFa && !isAuth) {
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
    if (validate) {
        updateUserList(user, true);
      return (<Navigate to="/" />);
    }
  }
  return (<Navigate to="/login" />);
};

export default AskTwoFa;
