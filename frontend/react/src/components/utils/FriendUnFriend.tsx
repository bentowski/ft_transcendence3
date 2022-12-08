import { useEffect, useState} from "react";
import { useAuthData } from "../../contexts/AuthProviderContext";
import Request from './Requests';
import { io } from "socket.io-client";

const sock = io("http://localhost:3000/update");

const FriendUnFriend = ({ auth_id }:{ auth_id: string }): JSX.Element => {
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
    }, [setError, auth_id])

    useEffect(() => {
        const handleUpdateFriends = (obj: any) => {
            console.log('handle update friends socket received');
            setStatus((prevState: boolean) => !prevState);
            updateFriendsList(obj.user, obj.action);
        }
        sock.on('onUpdateFriend', handleUpdateFriends);
        return () => {
            sock.off('onUpdateFriend');
        }
    }, [updateFriendsList, friendsList])

    const friendunfriendUser = async (): Promise<void> => {
        console.log('emiting updateFriend socket request');
        sock.emit('updateFriend', {
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
