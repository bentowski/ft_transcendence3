import {useEffect, useState} from "react";
import {useAuthData} from "../../contexts/AuthProviderContext";
import Request from './Requests';

const BlockUnBlock = ({ auth_id }:{ auth_id : string }) => {
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, blockedList, updateBlockedList, updateFriendsList, setError } = useAuthData();

    useEffect(() => {
        const updateStatus = async () => {
            if (auth_id !== undefined) {
                setLoading(true)
                try {
                    let res = await Request(
                        "GET",
                        {},
                        {},
                        "http://localhost:3000/user/" + auth_id + "/isblocked",
                    )
                    setStatus(res);
                    setLoading(false);
                    return ;
                } catch (error) {
                    console.log(error);
                    setLoading(false);
                    setError(error);
                }
            }
        }
        updateStatus();
    }, [auth_id, blockedList])

    const blockunblockUser = async () => {
        try {
            let res = await fetch("http://localhost:3000/user/update/blocked", {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ auth_id: auth_id, action: !status}),
            })
            if (res.ok) {
                setStatus((prevState: any) => !prevState);
                updateBlockedList(user, !status);
                updateFriendsList(user, status);
            }
        } catch (error) {
            console.log(error);
            setError(error);
        }
    }

    return (
        <div>
            <button onClick={blockunblockUser} >
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