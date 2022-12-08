import { useEffect, useState} from "react";
import { useAuthData } from "../../contexts/AuthProviderContext";
import Request from './Requests';
import { Socket } from "socket.io-client";

const FriendUnFriend = ({socket, auth_id}:{socket: Socket, auth_id:string}): JSX.Element => {
    const [status, setStatus] = useState<boolean>(false);
    const { user, friendsList, updateFriendsList, setError } = useAuthData();

    useEffect((): void => {
        const updateStatus = async (): Promise<void> => {
            if (auth_id !== undefined) {
                try {
                    const res: boolean = await Request(
                        "GET",
                        {},
                        {},
                        "http://localhost:3000/user/" + auth_id + "/isfriend",
                    )
                    setStatus(res);
                    return ;
                } catch (error) {
                    setError(error);
                }
            }
        }
        updateStatus();
    }, [setError, auth_id, friendsList])

    useEffect(() => {
        const handleUpdateFriends = (obj: any) => {
            console.log('handle update friends, ', obj)
            setStatus((prevState: boolean) => !prevState);
            updateFriendsList(obj.user, obj.action);
        }
        socket.on('onUpdateFriend', handleUpdateFriends);
        return () => {
            socket.off('onUpdateFriend');
        }
    },[friendsList])

    const friendunfriendUser = async (): Promise<void> => {
        /*
        const res: Response = await fetch("http://localhost:3000/user/update/friends", {
            method: "PATCH",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: !status, auth_id: auth_id }),
        })
        if (res.ok) {
            setStatus((prevState: any) => !prevState);
            const obj: UserType = await res.json();
            updateFriendsList(obj, !status);
        } else {
            const err: ErrorType = await res.json();
            setError(err);
        }
         */
        console.log('user ', user.auth_id, ' friending ', !status, ' user ', auth_id);
        socket.emit('updateFriend', {
            "curid": user.auth_id,
            "frid": auth_id,
            "action": !status,
        })
    }

    return (
        <div>
            <button onClick={() => friendunfriendUser()} >
                { status ?
                    <p>UNFRIEND</p>
                    :
                    <p>FRIEND</p> }
            </button>
        </div>
    )
}
export default FriendUnFriend;
