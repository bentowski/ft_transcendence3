import { useState } from "react";
// import { useAuthData } from "../contexts/AuthProviderContext";
import { useNavigate } from "react-router-dom";

const AskTwoFa = () => {
  // const { isAuth, isTwoFa, isToken, loading } = useAuthData();
  const [code, setCode] = useState("");
  const [validate, setValidate] = useState(false);
  // const location = useLocation();
  const navigate = useNavigate();
  // const from = location.state?.from?.pathname || "/";

  const validateTwoFa = () => {
    //console.log("code = ", code);
    try {
      //if (isTwoFa) {
      //console.log("before fetch");
      fetch("http://localhost:3000/auth/2fa/authenticate", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          twoFACode: code,
        }),
      })
        .then((res) => {
          res.json(); //console.log("ca na pas marche dsl");
        })
        .then((data) => {
          //console.log("data = ", data);
          navigate("/");
          setValidate(true);
        })
        .catch((error) => {
          //console.log("you did some shit ", error);
        });
      //} else {
      //   setIsAuth(true)
      // return;
      //}
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        //console.log("oulala -", error);
      } else {
        //console.log("unexpected error ", error);
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
    setCode(evt.target.value);
  };

  /*
  if (loading) {
    return <p>Loading...</p>;
  }
  if (isToken) {
    if (isTwoFa && !isAuth) {

   */
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

  /*
    }
    if (isAuth && validate) {
      return (
        <div>
          <Navigate to="/" />
        </div>
      );
    }
  }
  return <Navigate to="/login" state={{ from: location }} replace />;
*/
};
export default AskTwoFa;
//   <AuthContext.Consumer>
//                     {({ login }) => {
// }}
// </AuthContext.Consumer>
