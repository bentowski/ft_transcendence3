import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Request from "../components/utils/Requests";

export interface IAuthContextType {
  user: any;
  logout: () => void;
  isAuth: boolean;
  loading: boolean;
  over: boolean;
}

export const AuthContext = createContext<IAuthContextType>(
  {} as IAuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [over, setOver] = useState<boolean>(false);

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
    }
    setLoading(false);
    return;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setAuth = (value: any) => {
    setIsAuth(value);
  };

  const logout = async () => {
    console.log("logout called");
    let res = await Request(
      "DELETE",
      {},
      {},
      "http://localhost:3000/auth/logout"
    );
    console.log("res = ", res);
    if (res.status === 200) {
      console.log("loooooogggggeedddd oooo uuuuutttt");
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
