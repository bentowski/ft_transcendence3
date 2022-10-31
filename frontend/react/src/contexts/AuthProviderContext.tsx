import {
  createContext,
  ReactNode, useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Request from "../components/utils/Requests";
import IAuthContextType from "../interfaces/authcontexttype-interface";
import ResponseData from '../interfaces/error-interface';
import IError from "../interfaces/error-interface";
import {IResponseData} from "../interfaces/responsedata-interface";
import IUser from "../interfaces/user-interface";

export const AuthContext = createContext<any>(
  null
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isTwoFa, setIsTwoFa] = useState<boolean>(false);
  const [isToken, setIsToken] = useState<boolean>(false);
  const [user, setUser] = useState<any>(undefined);
  //const [over] = useState<boolean>(false);

  /*
  const login =  () => {
    //try {
    setLoading(true);

     fetch("http://localhost:3000/user/current", {
        method: "GET",
        credentials: "include",
      }).then((resp: any) =>
          resp.json()
      ).then((user: any) => {
        console.log('user = ', user);
        if (user.statusCode === 404) {
          setLoading(false);
          return ;
        }
        //setIsLogin(true);
        console.log('islogin = ', isLogin);
        if (user.isTwoFA === 1) {
          setIsTwoFa(true);
          setLoading(false);
          console.log('two fa activated');
          console.log('isauth = ', isAuth);

          console.log('istwofa = ', isTwoFa);
          console.log('loading = ', loading);
          return;
        } else if (user.isTwoFa === 0) {
          setUser(user);
          setLoading(false);
          setIsAuth(true);
          setIsTwoFa(false);
          return;
        }
      }).catch((error: any) => {
        console.log('oulala - ', error);
      })

    //} catch (error) {
      //if (typeof error === 'object' && error !== null) {
        //console.log('oulala -', error);
      //} else {
        //console.log('unexpected error ', error);
      //}
    //}
  }

   */

    const fetchData = () => {
      setLoading(true);
      setIsToken(false);
      setUser(undefined);
      //try {
       fetch("http://localhost:3000/auth/istoken", {
              method: "GET",
              credentials: "include",
            }
        ).then((res: any) =>
            res.json()
        ).then((data: any) => {
          console.log('data = ', data);
          if (data.isTok === 0) {
            console.log('403 baby');
            setLoading(false);
            return;
          } else if (data.isTok > 0) {
            console.log('before fetching');
            setIsToken(true);
            if (data.isTok === 1) {
              setLoading(false);
              return ;
            }
            console.log('fetching user');
            fetch("http://localhost:3000/user/current", {
              method: "GET",
              credentials: "include",
            }).then((resp: any) =>
                resp.json()
            ).then((user: any) => {
              console.log('user = ', user);
              if (user.statusCode === 404) {
                setLoading(false);
                return ;
              }
              //setIsToken(true);
              console.log('istoken = ', isToken);
              if (user.isTwoFA === 1) {
                setIsTwoFa(true);
                setLoading(false);
                console.log('two fa activated');
                console.log('isauth = ', isAuth);

                console.log('istwofa = ', isTwoFa);
                console.log('loading = ', loading);
                return;
              }
                console.log('no twofa');
                setUser(user);
                setLoading(false);
                setIsAuth(true);
                setIsTwoFa(false);
                return;
            }).catch((error: any) => {
              console.log('oulala - ', error);
            })
            return;
          }
        }).catch((error: any) => {
          console.log('1error = ', error);
          setLoading(false);
        })
      //} catch (error) {
        //if (typeof error === 'object' && error !== null) {
          //console.log('oulala -', error);
        //} else {
          //console.log('unexpected error ', error);
        //}
      //}
    }


      useEffect(() => {
        console.log('starts');
        fetchData();
        console.log('ends');
      }, [ /* loading, isTwoFa, user, error, isAuth, isLogin */ ]);



      const validateTwoFa =  useCallback(async (code: any) => {
        console.log('code = ', code);
        try {
          if (isTwoFa) {
            const body: any = JSON.stringify({twoFACode: code})
            let res = await Request(
                "POST",
                {},
                { body },
                "http://localhost:3000/auth/2fa/authenticate"
            )
            if (res.ok) {
              setIsAuth(true);
              console.log('2fa auth ok');
              return;
            }
          } else {
            setIsAuth(true)
            return;
          }
        } catch (error) {
          if (typeof error === 'object' && error !== null) {
            console.log('oulala -', error);
          } else {
            console.log('unexpected error ', error);
          }
        }
      }, [])

      const logout = useCallback(async () => {
        try {
          let res = await Request(
              "DELETE",
              {},
              {},
              "http://localhost:3000/auth/logout"
          );
          //console.log("res = ", res);
          if (res.status === 200) {
            setUser(undefined);
            setIsAuth(false);
            setIsToken(false);
            setIsTwoFa(false);
          }
        } catch (error) {
          if (typeof error === 'object' && error !== null) {
            console.log('oulala -', error);
          } else {
            console.log('unexpected error ', error);
          }
        }
      }, [])

      const deactivateTwoFa = useCallback(async () => {
        console.log('eeeee');
        if (isTwoFa) {
          let res = await Request(
              "POST",
              {},
              {},
              "http://localhost:3000/auth/2fa/deactivate"
          )
          if (res.ok) {
            console.log('deactivating two fa success');
            setIsTwoFa(false);
          } else {
            console.log('deactivating two fa fail');
          }
        }
      }, [])

        const activateTwoFa = useCallback(async () => {
          console.log('xxxxx');
          if (!isTwoFa) {
            let res = await Request(
                "POST",
                {},
                {},
                "http://localhost:3000/auth/2fa/activate"
            )
            if (res.ok) {
              setIsTwoFa(true);
              console.log('activating two fa success')
            } else {
              console.log('activating two fa fail')
            }
          }
        }, [])

      /*
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
      */

      const memoedValue = useMemo(
          () => ({
            user,
            isAuth,
            isToken,
            isTwoFa,
            error,
            loading,
            logout,
            //login,
            validateTwoFa,
            activateTwoFa,
            deactivateTwoFa,
          }),
          [user, isAuth, loading, logout, isToken, isTwoFa, activateTwoFa, deactivateTwoFa]
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
    }