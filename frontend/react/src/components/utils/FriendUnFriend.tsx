import { useEffect, useState } from "react";
import { useAuthData } from "../../contexts/AuthProviderContext";
import Request from './Requests';
import { ErrorType, UserType } from "../../types";

const FriendUnFriend = ({auth_id}:{auth_id:string}): JSX.Element => {
    const [status, setStatus] = useState<boolean>(false);
    const { friendsList, updateFriendsList, setError } = useAuthData();

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
    }, [auth_id, friendsList])

    const friendunfriendUser = async (): Promise<void> => {
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
