import {Socket} from "socket.io-client";
import React, {ReactNode, useEffect, useState} from "react";
import Request from "./Requests";
import {useAuthData} from "../../contexts/AuthProviderContext";
import {Modal} from 'react-bootstrap';
import {UsersChanAdminType, UsersChanBanType, UsersChanMuteType, UserType} from "../../types";
import {Link} from "react-router-dom";

const ModalAdminUser = ({chan, socket}:{chan:string, socket: Socket}) => {
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [list, setList] = useState<ReactNode[]>([]);
    const [usersChan, setUsersChan] = useState<UsersChanAdminType[]>([{user: undefined, isAdmin: false}]);
    const { user, adminFrom } = useAuthData();

    useEffect(() => {
        setLoading(true);
        const fetchOwner = async () => {
            let res: boolean = await Request(
                "GET",
                {},
                {},
                "http://localhost:3000/chan/" + chan + "/isowner",
            )
            setIsOwner(res);
        }
        const fetchUsersChan = async () => {
            let users: UserType[] = await Request(
                "GET",
                {},
                {},
                "http://localhost:3000/chan/" + chan + "/user"
            )
            const newArray: UsersChanAdminType[] = [];
            for (let index = 0; index < users.length; index++) {
                let result: boolean = await Request(
                    "GET",
                    {},
                    {},
                    "http://localhost:3000/chan/" + chan + "/isadmin/" + users[index].auth_id,
                )
                newArray.push({
                    user: users[index],
                    isAdmin: result,
                })
            }
            setUsersChan(newArray);
            setLoading(false);
        }
        fetchOwner();
        if (show) {
            fetchUsersChan();
        }
    }, [adminFrom, show])

    useEffect((): void => {
        if (usersChan) {
            listUserCards();
        }
    }, [usersChan])

    const adminUser = (obj: any) => {
        socket.emit('adminToChannel', { "room": chan, "auth_id": obj.user.auth_id, "action": !obj.isAdmin });
        //updateBannedFromList(chan, !obj.isBan);
        const newArray: UsersChanAdminType[] = [];
        for (let index: number = 0; index < usersChan.length; index++) {
            if (usersChan[index].user?.auth_id === obj.user.auth_id) {
                usersChan[index].isAdmin = !obj.isAdmin;
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
                            <button type="button" onClick={() => adminUser(usersChan[x])}>
                                {
                                    usersChan[x].isAdmin ?
                                        <p>UNADMIN</p> :
                                        <p>ADMIN</p>
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

    const handleOpen = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <div className="col-13">
            <Modal show={show} id="ModalCode" onHide={handleClose}>
                <div className="p-4 pb-1">
                    <Modal.Header className="mb-3">
                        <h2>Set Admin users</h2>
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
            {
                isOwner ?
                    <button className="col-3" onClick={handleOpen}>ADMIN</button> :
                    <p></p>
            }
        </div>
    )
}
export default ModalAdminUser;