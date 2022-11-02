import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Request from "../components/utils/Requests";
import IAuthContextType from "../interfaces/authcontexttype-interface";
import ResponseData from "../interfaces/error-interface";
import IError from "../interfaces/error-interface";
import { IResponseData } from "../interfaces/responsedata-interface";
import IUser from "../interfaces/user-interface";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isTwoFa, setIsTwoFa] = useState<boolean>(false);
  const [isToken, setIsToken] = useState<boolean>(false);
  const [user, setUser] = useState<any>(undefined);

  const fetchData = () => {
    setIsToken(false);
    setUser(undefined);
    setLoading(true);
    //console.log("here we go");
    try {
      fetch("http://localhost:3000/auth/istoken", {
        method: "GET",
        credentials: "include",
      })
        .then((res: any) => res.json())
        .then((data: any) => {
          //console.log("data tok = ", data.isTok);
          if (data.isTok === 0) {
            //console.log("403 baby");
            setLoading(false);
            return;
          } else if (data.isTok > 0) {
            //console.log("before fetching");
            setIsToken(true);
            if (data.isTok === 1) {
              setLoading(false);
              return;
            }
            //console.log("fetching user");
            fetch("http://localhost:3000/user/current", {
              method: "GET",
              credentials: "include",
            })
              .then((resp: any) => resp.json())
              .then((user: any) => {
                //console.log("user = ", user);
                if (user.statusCode === 404) {
                  setLoading(false);
                  return;
                }
                setUser(user);
                if (data.isTok === 2) {
                  setIsTwoFa(true);
                  setLoading(false);
                  //console.log("istok = 2");
                  return;
                }
                if (data.isTok === 3) {
                  //console.log("istok = 3");
                  setIsAuth(true);
                  setIsTwoFa(true);
                  setLoading(false);
                  return;
                }
                if (data.isTok === 4) {
                  setLoading(false);
                  //console.log("istok = 4");
                  setIsAuth(true);
                  return;
                }
                //console.log("ENDED NOWHERE!");
                return;
              })
              .catch((error: any) => {
                //console.log("oulala - ", error);
              })
              .finally(() => {
                setLoading(false);
              });
            setLoading(false);
            return;
          }
        })
        .catch((error: any) => {
          //console.log("1error = ", error);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        //console.log("oulala -", error);
        setLoading(false);
      } else {
        //console.log("unexpected error ", error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    //console.log('starts');
    if (!isToken) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const memoedValue = useMemo(
    () => ({
      user,
      isAuth,
      isToken,
      isTwoFa,
      error,
      loading,
    }),
    [error, user, isAuth, loading, isToken, isTwoFa]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthData = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUserContext was used outside of its Provider");
  }
  return context;
};
