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
import IUser from "../interfaces/user-interface";

export const AuthContext = createContext<IAuthContextType>(
  {} as IAuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState/*<Promise<IUser> | undefined>*/(undefined);
  const [over, setOver] = useState(false);

  const getCurrentUser = async () => {
    let cur = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user/current"
    ) /*.catch(() => {
      return {};
    }); */
    return cur;
  }

  const fetchData = async () => {
    setLoading(true);
    let data = await Request(
      "GET",
      {},
      {},
      "http://localhost:3000/auth/islogin"
    );
    if (!data) {
       setLoading(false);
      return;
    }
    if (data.isAuth) {
      setIsAuth(true);
      let cur = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/user/current"
      )
      if (cur) {
        setUser(cur);
      }
      //setLoading(false);
    }
    setLoading(false);
    return;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const logout = async () => {
    console.log("logout called");
    let res = await Request(
      "DELETE",
      {},
      {},
      "http://localhost:3000/auth/logout"
    );
    //console.log("res = ", res);
    if (res.status === 200) {
      //console.log("loooooogggggeedddd oooo uuuuutttt");
      setIsAuth(false);
    }
  };

  const memoedValue = useMemo(
    () => ({
      user,
      isAuth,
      loading,
      over,
      logout,
    }),
    [user, isAuth, loading, over, logout]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};
export const useAuthData = () => {
  return useContext(AuthContext);
};
