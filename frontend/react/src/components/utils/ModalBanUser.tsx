import {useAuthData} from "../../contexts/AuthProviderContext";
import Request from "./Requests";
import React, {ReactNode, useEffect, useState} from "react";
import {Modal} from 'react-bootstrap';
import {Link} from "react-router-dom";
import {UserType} from "../../types";
//import {socket} from "../../contexts/WebSocketContext";


const ModalBanUser = ({chan, socket}:{chan: any, socket: any}) => {
    const { user, setError } = useAuthData();
    const [show, setShow] = useState(false);
    const [usersChan, setUsersChan] = useState<any[]>([{user:{},isBan:false}]);
    const [list, setList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) {
            setLoading(true);
            const fetchUsersChan = async () => {
                try {
                    let users: UserType[] = await Request(
                        "GET",
                        {},
                        {},
                        "http://localhost:3000/chan/" + chan + "/user"
                    )
                    const newArr = [];
                    for (let index = 0; index < users.length; index++) {
                        newArr.push({
                            user: users[index],
                            isBan: false,
                        });
                    }
                    let banned = await Request(
                        "GET",
                        {},
                        {},
                        "http://localhost:3000/chan/" + chan + "/banned"
                    )
                    for (let index = 0; index < banned.length; index++) {
                        newArr.push({
                            user: banned[index],
                            isBan: true,
                        })
                    }
                    setUsersChan(newArr);
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    setError(error);
                }
            }
            fetchUsersChan();
        }
    }, [show])

    useEffect(() => {
        if (usersChan) {
            listUserCards();
        }
    }, [usersChan])

    const handleClose = () => {
        setShow(false);
    }

    const handleOpen = () => {
        setShow(true);
    }

    const banUser = async (obj: any) => {
        socket.emit('banToChannel', { "room": chan, "auth_id": obj.user.auth_id, "action": !obj.isBan });
        const newArray = [];
        for (let index = 0; index < usersChan.length; index++) {
            if (usersChan[index].user.auth_id === obj.user.auth_id) {
                usersChan[index].isBan = !obj.isBan;
            }
            newArray.push(usersChan[index]);
        }
        setUsersChan(newArray);
    }

    const listUserCards = () => {
        let ret = [];

        for(let x = 0; x < usersChan.length; x++)
        {
            if (usersChan[x].user.username !== user.username)
            {
                ret.push(
                        <div key={x} className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center">
                         <div className="col-5 h-100 overflow-hidden buttons">
                            <button type="button" onClick={ () => banUser(usersChan[x]) }>
                                {
                                    usersChan[x].isBan ?
                                        <p>UNBAN</p> :
                                        <p>BAN</p>
                                }
                            </button>
                         </div>
                        <div className="col-2 d-flex flex-row d-flex justify-content-center">
                            <input className={usersChan[x].user.status ? "online" : "offline"} type="radio"></input>
                        </div>
                        <div className="col-5 d-flex flex-row justify-content-end align-items-center">
                            <Link to={"/profil/" + usersChan[x].user.username} className="mx-2">{usersChan[x].user.username}</Link>
                            <img src={'http://localhost:3000/user/' + usersChan[x].user.auth_id + '/avatar'} className="miniAvatar" width={150} height={150}/>
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
                        <h2>Ban/Unban user from chan for 100 seconds</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="mb-3">
                            <div>
                                { loading ?
                                    <p>Please wait...</p>
                                    : list}
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
            <button className="col-6" onClick={handleOpen}>BAN</button>
        </div>
        )
}
export default ModalBanUser;