import { useContext, useEffect, useState } from "react";
import { useAuthData } from "../../contexts/AuthProviderContext";
import Request from './Requests';
import { WebsocketContextUpdate } from "../../contexts/WebSocketContextUpdate";
import { io } from "socket.io-client";

const socket = io('http://localhost:3000/update')

const FriendUnFriend = ({ auth_id }:{ auth_id: string }): JSX.Element => {
    const [status, setStatus] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { user, friendsList, setError } = useAuthData();
    //const socket = useContext(WebsocketContextUpdate);

    useEffect((): void => {
        const updateStatus = async (): Promise<void> => {
            if (auth_id !== undefined) {
                setLoading(true);
                try {
                    const res: boolean = await Request(
                        "GET",
                        {},
                        {},
                        "http://localhost:3000/user/" + auth_id + "/isfriend",
                    )
                    setStatus(res);
                    setLoading(false);
                    return ;
                } catch (error) {
                    setLoading(false)
                    setError(error);
                }
            }
        }
        updateStatus();
    }, [setError, auth_id, socket, friendsList])

    const friendunfriendUser = async (): Promise<void> => {
        socket.emit('updateFriend', {
            "curid": user.auth_id,
            "frid": auth_id,
            "action": !status,
        })
    }

    return (
        <div>
            { loading? <p></p> :
            <button onClick={() => friendunfriendUser()} >
                {status ?
                    <p>UNFRIEND</p>
                    :
                    <p>FRIEND</p>
                }
            </button>
            }
        </div>
    )
}
export default FriendUnFriend;
