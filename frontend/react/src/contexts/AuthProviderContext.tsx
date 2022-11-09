import {
  createContext,
  ReactNode,
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

  const fetchData = async () => {
    setIsToken(false);
    setUser(undefined);
    setLoading(true);
    //console.log("here we go");
    try {
      let res = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/auth/istoken"
      )
      if (res) {
        //console.log('REs = ', res.isTok);
        if (res.isTok === 0) {
          setLoading(false);
          return ;
        } else if (res.isTok > 0) {
          setIsToken(true);
          if (res.isTok === 1) {
            setLoading(false);
            return ;
          } else if (res.isTok > 1) {
            let user = await Request(
                "GET",
                {},
                {},
                "http://localhost:3000/user/current"
            )
            if (user) {
              setUser(user);
              if (res.isTok === 2) {
                setIsTwoFa(true);
                setLoading(false);
                return ;
              } else if (res.isTok === 3) {
                setIsTwoFa(true);
                setIsAuth(true);
                setLoading(false);
                return ;
              } else if (res.isTok === 4) {
                setIsAuth(true);
                setLoading(false);
                return ;
              }
            } else {
              setLoading(false);
              return ;
            }
          } else {
            setLoading(false);
            return ;
          }
        } else {
          setLoading(false);
          return ;
        }
      } else {
        setLoading(false);
      }
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
