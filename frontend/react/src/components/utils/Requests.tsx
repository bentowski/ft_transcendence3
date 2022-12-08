//import React from "react";
import {useAuthData} from "../../contexts/AuthProviderContext";
import {ErrorType} from "../../types";

const Logout = async (): Promise<void> => {
  const { userAuthentication } = useAuthData();

  await fetch("http://localhost:3000/auth/logout", {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          userAuthentication(false);
          return ;
        }
      })
      .catch((error) => {
        userAuthentication(false);
        return ;
      });
}

const Request = async (
    type: string,
    headers: any,
    body: any,
    url: string): Promise<any> =>
{
    console.log(url);
    if (type === "GET") {
      const response: Response = await fetch(url, {
        method: type,
        credentials: "include",
        headers: headers,
      });
      if (response.ok) {
        const res: any = await response.json();
        return res;
      } else {
        const err: ErrorType = await response.json();
        if (err.statusCode === 401) {
          await Logout();
        }
        throw err;
      }

    } else {
      const response: Response = await fetch(url, {
        method: type,
        headers: headers,
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const res: any = await response.json();
        return res;
      } else {
        const err: ErrorType = await response.json();
        if (err.statusCode === 401) {
          await Logout();
        }
        throw err;
      }
    }
}
export default Request;
