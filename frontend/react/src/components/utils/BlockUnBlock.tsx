import { useEffect, useState } from "react";
import { useAuthData } from "../../contexts/AuthProviderContext";
import Request from './Requests';
import {Socket} from "socket.io-client";

const BlockUnBlock = ({ socket, auth_id }:{ socket: Socket, auth_id : string }): JSX.Element => {
    const [status, setStatus] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { user, blockedList, updateBlockedList, setError } = useAuthData();

    useEffect((): void => {
        const updateStatus = async (): Promise<void> => {
            if (auth_id !== undefined) {
                setLoading(true)
                try {
                    const res: boolean = await Request(
                        "GET",
                        {},
                        {},
                        "http://localhost:3000/user/" + auth_id + "/isblocked",
                    )
                    setStatus(res);
                    setLoading(false);
                    return ;
                } catch (error) {
                    setLoading(false);
                    setError(error);
                }
            }
        }
        updateStatus();
    }, [setError, auth_id, blockedList])

    useEffect(() => {
        const handleUpdateBlocked = (obj: any, auth_id: string) => {
            if (user.auth_id === auth_id) {
                console.log('handle update blocked, ', obj.user, obj.action);
                setStatus((prevState: boolean) => !prevState);
                updateBlockedList(obj.user, obj.action);
            }
        }
        socket.on('onUpdateBlocked', handleUpdateBlocked);
        return () => {
            socket.off('onUpdateBlocked');
        }
    },[blockedList])

    const blockunblockUser = async (): Promise<void> => {
        /*
        try {
            await Request(
                "PATCH",
                {
                    'Content-Type': 'application/json'
                },
                { auth_id: auth_id, action: !status},
                "http://localhost:3000/user/update/blocked",
            )
            setStatus((prevState: boolean) => !prevState);
            updateBlockedList(user, !status);
        } catch (error) {
            setError(error);
        }
         */
        console.log('user ', user.auth_id, ' blocking ', !status, ' user ', auth_id);

        socket.emit('updateBlocked', {
            "curid": user.auth_id,
            "bloid": auth_id,
            "action": !status,
        })
    }

    return (
        <div>
            <button className="btn btn-outline-dark shadow-none" onClick={blockunblockUser} >
                { loading && <p></p>}
                { status ?
                <p>UNBLOCK</p>
                :
                <p>BLOCK</p> }
            </button>
        </div>
    )
}
export default BlockUnBlock;
