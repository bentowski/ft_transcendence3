import React, { Component, useEffect, useState } from "react";
import Request from "./Requests";
import { AuthContext, useAuthData } from "../../contexts/AuthProviderContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AskTwoFa = () => {
  const { isAuth, isTwoFa, isToken } = useAuthData();
  const [code, setCode] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const validateTwoFa = async () => {
    console.log("code = ", code);
    try {
      //if (isTwoFa) {
      console.log("before fetch");
      let res: any = await Request(
        "POST",
        {
          "Content-Type": "application/json",
        },
        { twoFACode: code },
        "http://localhost:3000/auth/2fa/authenticate"
      );
      console.log("res ===== ", res);
      if (res) {
        console.log("2fa auth ok");
        navigate(from);
        return;
      }
      //} else {
      //   setIsAuth(true)
      // return;
      //}
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        console.log("oulala -", error);
      } else {
        console.log("unexpected error ", error);
      }
    }
  };

  useEffect(() => {
    if (isAuth) {
      navigate(from);
    }
  });

  const handleChange = (evt: any) => {
    setCode(evt.target.value);
  };

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
};
export default AskTwoFa;
//   <AuthContext.Consumer>
//                     {({ login }) => {
// }}
// </AuthContext.Consumer>
