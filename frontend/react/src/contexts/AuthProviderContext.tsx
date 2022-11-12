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
import ResponseData from "../interfaces/error-interface";
import IError from "../interfaces/error-interface";
import { IResponseData } from "../interfaces/responsedata-interface";
import IUser from "../interfaces/user-interface";

export const AuthContext = createContext<any>({ error: null, /* changeFriendsList: () => {}, */ setError: (value: any) => {}});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isTwoFa, setIsTwoFa] = useState<boolean>(false);
  const [isToken, setIsToken] = useState<boolean>(false);
  const [user, setUser] = useState<any>(undefined);
  const [errorShow, setErrorShow] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [errorCode, setErrorCode] = useState<number>(0);
  const [userList, setUserList] = useState<string[]>([]);
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [blockedList, setBlockedList] = useState<string[]>([]);

  /*
  const fetchBlockedList = async () => {
    let list = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user/" + user.auth_id + "/getblocked"
    )
    let array_usernames: string[] = [];
    for (let index = 0; index < list.length; index++) {
      array_usernames[index] = list[index].username;
    }
    setBlockedList(array_usernames);
  }

  const fetchFriendsList = async () => {
    let list = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user/" + user.auth_id + "/getfriends",
    )
    let array_usernames: string[] = [];
    for (let index = 0; index < list.length; index++) {
      array_usernames[index] = list[index].username;
    }
    setFriendsList(array_usernames);
  }
   */

  const fetchUserList = async () => {
    let list = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user"
    )
    let array_usernames: string[] = [];
    for (let index = 0; index < list.length; index++) {
      array_usernames[index] = list[index].username;
    }
    setUserList(array_usernames);
  }

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

                //------------------

                let flist = await Request(
                    "GET",
                    {},
                    {},
                    "http://localhost:3000/user/" + user.auth_id + "/getfriends",
                )
                let array_friends: string[] = [];
                for (let index = 0; index < flist.length; index++) {
                  array_friends[index] = flist[index].auth_id;
                }
                setFriendsList(array_friends);

                //-----------------

                let blist = await Request(
                    "GET",
                    {},
                    {},
                    "http://localhost:3000/user/" + user.auth_id + "/getblocked"
                )
                let array_usernames: string[] = [];
                for (let index = 0; index < blist.length; index++) {
                  array_usernames[index] = blist[index].auth_id;
                }
                setBlockedList(array_usernames);

                //------------------

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

  /*
  const changeFriendsList = useCallback(async () => {
    let flist = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user/" + user.auth_id + "/getfriends",
    )
    let array_friends: string[] = [];
    for (let index = 0; index < flist.length; index++) {
      array_friends[index] = flist[index].auth_id;
    }
    setFriendsList(array_friends);
  }, [])
   */

  const setError =  useCallback((value: any) => {
    console.log('error value = ', value);
    if (value) {
      setErrorShow(true);
      setErrorMsg(value.message);
      setErrorCode(value.statusCode);
    } else {
      setErrorShow(false);
      setErrorMsg('');
      setErrorCode(0);
    }
  },[])

  useEffect(() => {
    //console.log('starts');
    if (!isToken) {
      fetchData();
      fetchUserList();
      //fetchFriendsList();
      //fetchBlockedList();
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
      errorShow,
      errorMsg,
      errorCode,
      loading,
      userList,
      friendsList,
      blockedList,
      //changeFriendsList: () => {},
      //changeBlockedList: () => {},
      setError: (value: any) => setError(value),
    }),
    [
      errorShow,
      errorMsg,
      errorCode,
      user,
      isAuth,
      loading,
      isToken,
      isTwoFa,
      friendsList,
      blockedList,
      userList
    ]
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
