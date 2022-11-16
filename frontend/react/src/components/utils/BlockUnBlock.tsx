import {useEffect, useState} from "react";
import {useAuthData} from "../../contexts/AuthProviderContext";
import Request from './Requests';

const BlockUnBlock = ({ auth_id }:{ auth_id : string }) => {
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, updateBlockedList } = useAuthData();

    const updateStatus = async () => {
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
        }
    }

    useEffect(() => {
        if (auth_id !== undefined) {
            updateStatus();
        }
    }, [auth_id])

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
            }
        } catch (error) {
            console.log(error);
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