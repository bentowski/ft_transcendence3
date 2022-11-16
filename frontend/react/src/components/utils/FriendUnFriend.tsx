import {useEffect, useState} from "react";
import {useAuthData} from "../../contexts/AuthProviderContext";
import Request from './Requests';
import {useLocation, useNavigate} from "react-router-dom";
import {UserType} from "../../types";

const FriendUnFriend = ({auth_id}:{auth_id:string}) => {
    const [status, setStatus] = useState(false);
    const { friendsList, updateFriendsList } = useAuthData();

    useEffect(() => {
        const updateStatus = async () => {
            if (auth_id !== undefined) {
                try {
                    let res = await Request(
                        "GET",
                        {},
                        {},
                        "http://localhost:3000/user/" + auth_id + "/isfriend",
                    )
                    setStatus(res);
                    return ;
                } catch (error) {
                    console.log(error);
                }
            }
        }
        updateStatus();
    }, [auth_id, friendsList])

    const friendunfriendUser = async () => {
        try {
            let res = await fetch("http://localhost:3000/user/update/friends", {
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
            }
        } catch (error) {
            console.log(error);
        }
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