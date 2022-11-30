import { ReactNode, useEffect, useState } from "react";
import { useAuthData } from "../../contexts/AuthProviderContext";
import Request from "./Requests";
import { Modal } from 'react-bootstrap';
import { Link } from "react-router-dom";
import {ChanType, UsersChanMuteType, UserType} from "../../types";
import {Socket} from "socket.io-client";

const ModalMuteUser = ({chan, socket}:{chan: ChanType, socket: Socket}): JSX.Element => {
    const { user, setError, updateMutedFromList } = useAuthData();
    const [ show, setShow ] = useState<boolean>(false);
    const [ usersChan, setUsersChan ] = useState<UsersChanMuteType[]>([{user: undefined, isMute:false}]);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ list, setList ] = useState<any[]>([]);

    useEffect((): void => {
        if (show) {
            setLoading(false);
            const fetchUsersChan = async (): Promise<void> => {
                try {
                    let users: UserType[] = await Request(
                        "GET",
                        {},
                        {},
                        "http://localhost:3000/chan/" + chan + "/user"
                    )
                    const newArray: UsersChanMuteType[] = [];
                    for (let index = 0; index < users.length; index++) {
                        let result: boolean = await Request(
                            "GET",
                            {},
                            {},
                            "http://localhost:3000/chan/" + chan + "/ismuted/" + users[index].auth_id,
                        )
                        newArray.push({
                            user: users[index],
                            isMute: result,
                        })
                    }
                    setUsersChan(newArray);
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    setError(error);
                }
            }
            fetchUsersChan();
        }
    }, [show])

    useEffect((): void => {
        if (usersChan) {
            listUserCards();
        }
    }, [usersChan])

    const handleClose = (): void => {
        setShow(false);
    }

    const handleOpen = (): void => {
        setShow(true);
    }

    const muteUser = (obj: any): void => {
        socket.emit('muteToChannel', { "room": chan, "auth_id": obj.user.auth_id, "action": !obj.isMute });
        //updateMutedFromList(chan, !obj.isMute)
        const newArray: UsersChanMuteType[] = [];
        for (let index: number = 0; index < usersChan.length; index++) {
            if (usersChan[index].user?.auth_id === obj.user.auth_id) {
                usersChan[index].isMute = !obj.isMute;
            }
            newArray.push(usersChan[index]);
        }
        setUsersChan(newArray);
    }

    const listUserCards = async (): Promise<void> => {
        let ret: ReactNode[] = []

        for(let x: number = 0; x < usersChan.length; x++)
        {
            if (usersChan[x].user?.username !== user.username)
            {
                ret.push(
                    <div key={x} className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center">
                        <div className="col-5 h-100 overflow-hidden buttons">
                            <button type="button" onClick={() => muteUser(usersChan[x])}>
                                {
                                 usersChan[x].isMute ?
                                 <p>UNMUTE</p> :
                                 <p>MUTE</p>
                                }
                            </button>
                        </div>
                        <div className="col-2 d-flex flex-row d-flex justify-content-center">
                            <input className={usersChan[x].user?.status ? "online" : "offline"} type="radio"></input>
                        </div>
                        <div className="col-5 d-flex flex-row justify-content-end align-items-center">
                            <Link to={"/profil/" + usersChan[x].user?.username} className="mx-2">{usersChan[x].user?.username}</Link>
                            <img alt="" src={'http://localhost:3000/user/' + usersChan[x].user?.auth_id + '/avatar'} className="miniAvatar" width={150} height={150}/>
                        </div>
                    </div>
                );
            }
        }
        setList(ret);
    }

    return (
        <div className="col-6">
            <Modal show={show} id="ModalCode" onHide={handleClose}>
                <div className="p-4 pb-1">
                    <Modal.Header className="mb-3">
                        <h2>Mute/Unmute user from channel for 100 seconds</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="mb-3">
                            <div>
                                { loading ?
                                    <p>please wait...</p>
                                    : list
                                }
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="mx-1" onClick={handleClose}>
                            Close
                        </button>
                    </Modal.Footer>
                </div>
            </Modal>
            <button className="col-6" onClick={handleOpen}>MUTE</button>
        </div>
    )

}
export default ModalMuteUser;
