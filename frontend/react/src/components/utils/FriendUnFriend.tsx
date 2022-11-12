import {useEffect, useState} from "react";
import {useAuthData} from "../../contexts/AuthProviderContext";
import Request from './Requests';
import {useLocation, useNavigate} from "react-router-dom";

const FriendUnFriend = ({auth_id}:{auth_id:string}) => {
    const [status, setStatus] = useState(false);
    const [loading, setLoading ] = useState(false);
    const { user, friendsList } = useAuthData();
    const navigate = useNavigate();
    const location = useLocation();

    const updateStatus = async () => {
        setLoading(true);
        try {

            let res = await Request(
                "GET",
                {},
                {},
                "http://localhost:3000/user/" + auth_id + "/isfriend",
            )


            /*
            for (let index = 0; index < friendsList.length; index++) {
                if (friendsList[index] === auth_id) {
                    setStatus(true);
                    setLoading(false)
                    return ;
                }
            }

             */
            //console.log('res = ', res);
            setStatus(res);
            setLoading(false);
            return ;
            //}
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (auth_id !== undefined) {
            updateStatus();
            //console.log('status = ', status);
        }
    }, [auth_id])

    const friendunfriendUser = async () => {
        //console.log('STATUS  - ', status);
        let action: boolean = true;
        if (status) {
            action = false;
        }
        try {
            let res = await fetch("http://localhost:3000/user/updatefriend", {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: action, auth_id: auth_id }),
            })
            if (res.ok) {
                setStatus(action);
                //console.log('request succeed!');
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <button onClick={friendunfriendUser} >
            { loading && <p></p>}
            { status ?
                <p>UNFRIEND</p>
                :
                <p>FRIEND</p> }
        </button>
    )
}
export default FriendUnFriend;