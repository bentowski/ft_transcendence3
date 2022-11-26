import {useEffect, useState} from "react";
import {useAuthData} from "../../contexts/AuthProviderContext";
import Request from './Requests';

const BlockUnBlock = ({ auth_id }:{ auth_id : string }) => {
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, blockedList, updateBlockedList, setError } = useAuthData();

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
                    setLoading(false);
                    setError(error);
                }
            }
        }
        updateStatus();
    }, [auth_id, blockedList])

    const blockunblockUser = async () => {
        try {
            await Request(
                "PATCH",
                {
                    'Content-Type': 'application/json'
                },
                { auth_id: auth_id, action: !status},
                "http://localhost:3000/user/update/blocked",
            )
            setStatus((prevState: any) => !prevState);
            updateBlockedList(user, !status);
        } catch (error) {
            setError(error);
        }
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
