import {
  createContext,
  ReactNode, useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Request from "../components/utils/Requests";
import {AuthType, ChanType, UserType} from "../types";
import {NavigateFunction, useLocation, useNavigate} from "react-router-dom";

export const AuthContext = createContext<any>({
  /*
  updateUser: (avatar: string, username: string) => {},
  userAuthentication: (auth: boolean) => {},
  updateFriendsList: (usr: UserType, action: boolean) => {},
  updateUserList: () => {},
  updateBlockedList: (usr: UserType, action: boolean) => {},
  updateBannedFromList: () => {},
  updateMutedFromList: () => {},
  updateChanFromList: () => {},
  updateAllChans: () => {},
  setError: (value: any) => {}
   */
});

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
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
  const [allChans, setAllChans] = useState<ChanType[]>([]);
  const [bannedFrom, setBannedFrom] = useState<ChanType[]>([]);
  const [mutedFrom, setMutedFrom] = useState<ChanType[]>([]);
  const [chanFrom, setChanFrom] = useState<ChanType[]>([]);
  const [adminFrom, setAdminFrom] = useState<ChanType[]>([]);
  const navigate: NavigateFunction = useNavigate();
  const location: any = useLocation();

  const fetchUserList = async (): Promise<void> => {
    let list: UserType[] = [];
    try {
      list = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/user"
      )
    } catch (error) {
      setError(error);
    }
    const array_users: string[] = [];
    for (let index = 0; index < list.length; index++) {
      array_users[index] = list[index].username;
    }
    setUserList(array_users);
  }

  const fetchData = async (): Promise<void> => {
    setIsToken(false);
    setUser(undefined);
    setLoading(true);
    try {
      const res: AuthType = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/auth/istoken"
      )
      if (res) {
        if (res.isTok === 0) {
          setLoading(false);
          return ;
        } else if (res.isTok > 0) {
          setIsToken(true);
          if (res.isTok === 1) {
            setLoading(false);
            return ;
          } else if (res.isTok > 1) {
            const user: UserType = await Request(
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

                const chans: ChanType[] = await Request(
                    "GET",
                    {},
                    {},
                    "http://localhost:3000/chan"
                )
                setAllChans(chans);

                //------------------

                const flist: UserType[] = await Request(
                    "GET",
                    {},
                    {},
                    "http://localhost:3000/user/" + user.auth_id + "/getfriends",
                )
                const array_friends: string[] = [];
                for (let index = 0; index < flist.length; index++) {
                  array_friends[index] = flist[index].auth_id;
                }
                setFriendsList(array_friends);

                //-----------------

                const blist: UserType[] = await Request(
                    "GET",
                    {},
                    {},
                    "http://localhost:3000/user/" + user.auth_id + "/getblocked"
                )
                const array_blocked: string[] = [];
                for (let index = 0; index < blist.length; index++) {
                  array_blocked[index] = blist[index].auth_id;
                }
                setBlockedList(array_blocked);

                //------------------

                const mlist: ChanType[] = await Request(
                    "GET",
                    {},
                    {},
                    "http://localhost:3000/user/chan/muted"
                )
                setMutedFrom(mlist);

                //------------------

                const banlist: ChanType[] = await Request(
                    "GET",
                    {},
                    {},
                    "http://localhost:3000/user/chan/banned"
                )
                setBannedFrom(banlist);

                //------------------

                const jlist: ChanType[] = await Request(
                    "GET",
                    {},
                    {},
                    "http://localhost:3000/user/chan/joined"
                )
                setChanFrom(jlist);

                //--------------------

                const alist: ChanType[] = await Request(
                    "GET",
                    {},
                    {},
                    "http://localhost:3000/user/chan/admin"
                )
                setAdminFrom(alist);

                //--------------------

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
        setError(error);
        setLoading(false);
      } else {
        setError(error);
        setLoading(false);
      }
    }
  };

  const updateFriendsList = useCallback(async (
      usr: UserType,
      action: boolean): Promise<void> => {
    const auth_id: string = usr.auth_id;
    if (action) {
      setFriendsList(prevState => [...prevState, auth_id]);
      return ;
    } else if (!action) {
      const idx: number = friendsList.findIndex(obj => {
        return obj === auth_id;
      });
      const array: string[] = [ ...friendsList ];
      if (idx !== -1) {
        array.splice(idx, 1);
        setFriendsList(array);
        return ;
      }
    }
  }, [friendsList])

  const updateBlockedList = useCallback((
      usr: UserType,
      action: boolean): void => {
    const auth_id: string = usr.auth_id;
    if (action) {
      setBlockedList(prevState => [...prevState, auth_id]);
      return ;
    } else if (!action) {
      const idx: number = blockedList.findIndex(obj => {
        return obj === auth_id;
      });
      const array: string[] = [...blockedList];
      if (idx !== -1) {
        array.splice(idx, 1);
        setBlockedList(array);
        return ;
      }
    }
  }, [blockedList])

  const updateUserList = useCallback(async (): Promise<void> => {
    let list: UserType[] = [];
    try {
      list = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/user"
      )
    } catch (error) {
      setError(error);
    }
    const array_users: string[] = [];
    for (let index = 0; index < list.length; index++) {
      array_users[index] = list[index].username;
    }
    setUserList(array_users);
  }, [])

  const rmvBan = (chan: ChanType): void => {
    const idx: number = bannedFrom.findIndex(obj => {
      return obj.id === chan.id;
    })
    const newArr: ChanType[] = bannedFrom;
    if (idx !== -1) {
      newArr.splice(idx);
    }
    setBannedFrom(newArr);
  }

  const rmvMute = (chan: ChanType): void => {
    const idx: number = bannedFrom.findIndex(obj => {
      return obj.id === chan.id;
    })
    const newArr: ChanType[] = mutedFrom;
    if (idx !== -1) {
      newArr.splice(idx);
    }
    setMutedFrom(newArr);
  }


  const updateBannedFromList = useCallback( (
      chan: ChanType,
      action: boolean): void => {
    if (action) {
      setBannedFrom(prevState => [...prevState, chan])
      setTimeout(() => {
        console.log('ban is over :)')
        rmvBan(chan);
      }, 10000)
    }
    if (!action) {
      rmvBan(chan);
    }
  }, [bannedFrom])

  const updateAdminFromList = useCallback((
      chan: ChanType,
      action: boolean): void => {
    if (action) {
      setAdminFrom(prevState => [...prevState, chan])
    }
    if (!action) {
      const i: number = adminFrom.findIndex(obj => {
        return obj.id === chan.id;
      })
      const newArr: ChanType[] = adminFrom;
      if (i !== -1) {
        newArr.splice(i);
      }
      setAdminFrom(newArr);
    }
  }, [])


  const updateMutedFromList = useCallback(  (
      chan: ChanType, action: boolean): void => {
      if (action) {
        setMutedFrom(prevState => [...prevState, chan])
        setTimeout(() => {
          rmvMute(chan);
        }, 10000)
      }
      if (!action) {
        rmvMute(chan);
      }
  }, [mutedFrom])

  const updateChanFromList = useCallback((
      chan: ChanType,
      action: boolean): void => {
      if (action) {
        setChanFrom(prevState => [...prevState, chan])
      }
      if (!action) {
        const idx = chanFrom.findIndex(obj => {
          return obj.id === chan.id;
        })
        const newArr: ChanType[] = chanFrom;
        if (idx !== -1) {
          newArr.splice(idx);
        }
        setChanFrom(newArr);
      }
  }, [chanFrom])

  const updateAllChans = useCallback(async (): Promise<void> => {
    try {
      const res: ChanType[] = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/chan"
      )
      setAllChans(res);
    } catch (error) {
      setError(error);
    }
  }, [])


  const updateUser = useCallback((avatar: string, username: string): void => {
    if (avatar || username) {
      const usr: UserType = {
        user_id: user.user_id,
        auth_id: user.auth_id,
        username: username ? username : user.username,
        avatar: avatar ? avatar : user.avatar,
        game_won: user.game_won,
        game_lost: user.game_lost,
        total_games: user.total_games,
        total_score: user.total_score,
        status: user.status,
        twoFASecret: user.twoFASecret,
        isTwoFA: user.isTwoFa,
        channelJoind: user.channelJoind,
        friends: user.friends,
        blocked: user.blocked,
      }
      setUser(usr);
    }
  }, [user])

  const userAuthentication = useCallback((auth: boolean): void => {
    if (user) {
      setIsAuth(auth);
    }
  }, [user])

  const setError =  useCallback((value: any): void => {
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

  useEffect((): void => {
    fetchData();
    fetchUserList();
  }, []);

  const memoedValue = useMemo(
    () => ({
      user,
      isAuth,
      isToken,
      isTwoFa,
      allChans,
      bannedFrom,
      mutedFrom,
      adminFrom,
      chanFrom,
      errorShow,
      errorMsg,
      errorCode,
      loading,
      userList,
      friendsList,
      blockedList,
      updateUser: (avatar: string, username: string) => updateUser(avatar, username),
      userAuthentication: (auth: boolean) => userAuthentication(auth),
      updateFriendsList: (usr: UserType, action: boolean) => updateFriendsList(usr, action),
      updateUserList: () => updateUserList(),
      updateBlockedList: (usr: UserType, action: boolean) => updateBlockedList(usr, action),
      updateBannedFromList: (chan: ChanType, action: boolean) => updateBannedFromList(chan, action),
      updateChanFromList: (chan: ChanType, action: boolean) => updateChanFromList(chan, action),
      updateMutedFromList: (chan: ChanType, action: boolean) => updateMutedFromList(chan, action),
      updateAdminFromList: (chan: ChanType, action: boolean) => updateAdminFromList(chan, action),
      updateAllChans: () => updateAllChans(),
      setError: (value: any) => setError(value),
      navigate,
      location,
    }),
    [
      errorShow,
      errorMsg,
      errorCode,
      user,
      isAuth,
      loading,
      allChans,
      bannedFrom,
      mutedFrom,
      chanFrom,
      adminFrom,
      isToken,
      isTwoFa,
      updateBannedFromList,
      updateChanFromList,
      updateMutedFromList,
      updateFriendsList,
      updateAllChans,
      userAuthentication,
      updateUserList,
      updateUser,
      updateBlockedList,
      setError,
      userList,
      friendsList,
      blockedList,
      navigate,
      location,
    ]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthData = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("Context was used outside of its Provider");
  }
  return context;
};
