//import IError from "../../interfaces/error-interface";
//import {useAuthData} from "../../contexts/AuthProviderContext";
//import {useEffect, useState} from "react";
//import {HandleError} from "./HandleError";
//import {ErrorContext, useErrorContext} from "../../contexts/ErrorProviderContext";
//import useRequest from "../../hooks/useRequest";
import React, {useEffect, useState} from "react";
import {ErrorContext, useErrorContext} from "../../contexts/ErrorProviderContext";

const logout = async () => {
  let res = await fetch("http://localhost:3000/auth/logout", {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (res.ok) {
    window.location.reload()
  }
}

const Request = async (type: string, headers: any, body: any, url: string) => {
  //const { setError } = useErrorContext()
  //const [response, setResponse] = useState<any>(null);
  //const [error, setError] = useState<any>(null);

  //const fetchRequest = async () => {
    console.log(url);
    if (type === "GET") {
      const response: any = await fetch(url, {
        method: type,
        credentials: "include",
        headers: headers,
      });
      if (response.ok) {
        const res = await response.json();
        //console.log('res = ', res);
        return res;
      } else {
        const err: any = await response.json();
        if (err.statusCode === 401) {
          logout();
        }
        //setError(err);
        throw err;
      }
    } else {
      const response: any = await fetch(url, {
        credentials: "include",
        method: type,
        headers: headers,
        body: JSON.stringify(body),
      });
      //console.log("response = ", response);
      if (response.ok) {
        const res = await response.json();
        return res;
      } else {
        const err: any = await response.json();
        if (err.statusCode === 401) {
          logout();
        }
        //setError(err);
        throw err;
      }
    }
  //useEffect(() => {
    //fetchRequest();
  //}, [response, error])

  //if (response) {
    //return response;
  //} else if (error) {
    //throw error;
  //}
}
export default Request;
