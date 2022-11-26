import {
  createContext,
  ReactNode, useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Request from "../components/utils/Requests";
import {ChanType, UserType} from "../types";

export const AuthContext = createContext<any>({
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
});

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
  const [allChans, setAllChans] = useState<ChanType[]>([]);
  const [bannedFrom, setBannedFrom] = useState<ChanType[]>([]);
  const [mutedFrom, setMutedFrom] = useState<ChanType[]>([]);
  const [chanFrom, setChanFrom] = useState<ChanType[]>([]);

  const fetchUserList = async () => {
    let list = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user"
    )
    let array_users: string[] = [];
    for (let index = 0; index < list.length; index++) {
      array_users[index] = list[index].username;
    }
    setUserList(array_users);
  }

  const fetchChans = async () => {
    let chans = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/chan"
    )
    setAllChans(chans);
  }

  const fetchData = async () => {
    setIsToken(false);
    setUser(undefined);
    setLoading(true);
    try {
      let res = await Request(
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
          fetchChans();
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
                let array_blocked: string[] = [];
                for (let index = 0; index < blist.length; index++) {
                  array_blocked[index] = blist[index].auth_id;
                }
                setBlockedList(array_blocked);

                //------------------

                let mlist = await Request(
                    "GET",
                    {},
                    {},
                    "http://localhost:3000/user/chan/muted"
                )
                setMutedFrom(mlist);

                //------------------

                let banlist = await Request(
                    "GET",
                    {},
                    {},
                    "http://localhost:3000/user/chan/banned"
                )
                setBannedFrom(banlist);

                //------------------

                let jlist = await Request(
                    "GET",
                    {},
                    {},
                    "http://localhost:3000/user/chan/joined"
                )
                setChanFrom(jlist);

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

  const updateFriendsList = useCallback(async (usr: UserType, action: boolean) => {
    const auth_id: string = usr.auth_id;
    if (action) {
      setFriendsList(prevState => [...prevState, auth_id]);
      return ;
    } else if (!action) {
      const idx: number = friendsList.findIndex(obj => {
        return obj === auth_id;
      });
      let array = [ ...friendsList ];
      if (idx !== -1) {
        array.splice(idx, 1);
        setFriendsList(array);
        return ;
      }
    }
  }, [friendsList])

  const updateBlockedList = useCallback((usr: UserType, action: boolean) => {
    const auth_id: string = usr.auth_id;
    if (action) {
      setBlockedList(prevState => [...prevState, auth_id]);
      return ;
    } else if (!action) {
      const idx: number = blockedList.findIndex(obj => {
        return obj === auth_id;
      });
      let array = [...blockedList];
      if (idx !== -1) {
        array.splice(idx, 1);
        setBlockedList(array);
        return ;
      }
    }
  }, [blockedList])

  const updateUserList = useCallback(async () => {
    let list = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user"
    )
    let array_users: string[] = [];
    for (let index = 0; index < list.length; index++) {
      array_users[index] = list[index].username;
    }
    setUserList(array_users);
  }, [])

  /*
  const rmvBan = (chan: ChanType) => {
    const idx = bannedFrom.findIndex(obj => {
      return obj.id === chan.id;
    })
    const newArr: ChanType[] = bannedFrom;
    if (idx !== -1) {
      newArr.splice(idx);
    }
    setBannedFrom(newArr);
  }

  const rmvMute = (chan: ChanType) => {
    const idx = bannedFrom.findIndex(obj => {
      return obj.id === chan.id;
    })
    const newArr: ChanType[] = mutedFrom;
    if (idx !== -1) {
      newArr.splice(idx);
    }
    setMutedFrom(newArr);
  }
  */

  const updateBannedFromList = useCallback(async () => {
    /*
    if (action) {
      setBannedFrom(prevState => [...prevState, chan])
      setTimeout(() => {
        rmvBan(chan);
      }, 10000)
    }
    if (!action) {
      rmvBan(chan);
    }
     */
    let banlist = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user/chan/banned"
    )
    setBannedFrom(banlist);
    setTimeout(async () => {
      let banlist = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/user/chan/banned"
      )
      setBannedFrom(banlist);
    }, 100010)

  }, [bannedFrom])

  const updateMutedFromList = useCallback( async () => {
    /*
    if (action) {
      setMutedFrom(prevState => [...prevState, chan])
      setTimeout(() => {
        rmvMute(chan);
      }, 10000)
    }
    if (!action) {
      rmvMute(chan);
    }
     */
    let mlist = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user/chan/muted"
    )
    setBannedFrom(mlist);
    setTimeout(async () => {
      let mlist = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/user/chan/muted"
      )
      setBannedFrom(mlist);
    }, 100010)

  }, [mutedFrom])

  const updateChanFromList = useCallback(async () => {
    /*
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
    */
    let jlist = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user/chan/joined"
    )
    setChanFrom(jlist);

  }, [chanFrom])

  const updateAllChans = useCallback(async () => {
    try {
      let res = await Request(
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


  const updateUser = useCallback((avatar: string, username: string) => {
    //console.log('callback called');
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

  const userAuthentication = useCallback((auth: boolean) => {
    if (user) {
      setIsAuth(auth);
    }
  }, [user])

  const setError =  useCallback((value: any) => {
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
      chanFrom,
      errorShow,
      errorMsg,
      errorCode,
      loading,
      userList,
      friendsList,
      updateUser: (avatar: string, username: string) => updateUser(avatar, username),
      userAuthentication: (auth: boolean) => userAuthentication(auth),
      updateFriendsList: (usr: UserType, action: boolean) => updateFriendsList(usr, action),
      updateUserList: () => updateUserList(),
      updateBlockedList: (usr: UserType, action: boolean) => updateBlockedList(usr, action),
      updateBannedFromList: () => updateBannedFromList(),
      updateChanFromList: () => updateChanFromList(),
      updateMutedFromList: () => updateMutedFromList(),
      updateAllChans: () => updateAllChans(),
      setError: (value: any) => setError(value),
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
