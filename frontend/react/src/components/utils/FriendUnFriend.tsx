import {useEffect, useState} from "react";
import {useAuthData} from "../../contexts/AuthProviderContext";
import Request from './Requests';
import {useLocation, useNavigate} from "react-router-dom";
import {UserType} from "../../types";

const FriendUnFriend = ({auth_id}:{auth_id:string}) => {
    const [status, setStatus] = useState(false);
    const [loading, setLoading ] = useState(false);
    const { friendsList, updateFriendsList } = useAuthData();

    useEffect(() => {
        setLoading(true);
        const updateStatus = async () => {
            if (auth_id !== undefined) {
                setLoading(true);
                try {
                    let res = await Request(
                        "GET",
                        {},
                        {},
                        "http://localhost:3000/user/" + auth_id + "/isfriend",
                    )
                    //console.log('res = ', res);
                    setStatus(res);
                    return ;
                } catch (error) {
                    //console.log(error);
                }
            }
        }
        updateStatus();
        setLoading(false);
    }, [auth_id, friendsList])

    const friendunfriendUser = async () => {
        //let action: boolean = true;
        //if (status) {
        //    action = false;
        //}
        try {
            let res = await fetch("http://localhost:3000/user/updatefriend", {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: !status, auth_id: auth_id }),
            })
            if (res.ok) {
                console.log('status - ', !status)
                setStatus(!status);
                const obj: UserType = await res.json();
                console.log('lets go ---------- ', res);
                updateFriendsList(obj, !status);
            }
        } catch (error) {
            console.log(error);
        }
    }
    if (loading) {
        <p>LOADING</p>
    }
    return (
        <button onClick={() => friendunfriendUser()} >
            { status ?
                <p>UNFRIEND</p>
                :
                <p>FRIEND</p> }
        </button>
    )
}
export default FriendUnFriend;