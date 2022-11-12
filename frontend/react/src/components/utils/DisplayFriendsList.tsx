import {useEffect, useState} from "react";
import {useAuthData} from "../../contexts/AuthProviderContext";
import Request from "./Requests";
import UserCards from "./UserCards";
import {UserType} from "../../types";

const DisplayFriendsList = () => {
    const [friendsList, setFriendsList] = useState<UserType[]>([]);
    const { user } = useAuthData();


    const updateFriendsList = async () => {
        try {
            let res = await Request(
                "GET",
                {},
                {},
                "http://localhost:3000/user/" + user.auth_id + "/getfriends/",
            )
            setFriendsList(res);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        //updateFriendsList();
    }, [])

    const fetchUser = async (x: number) => {
        console.log('xxx = ', x)
        return (await Request(
            "GET",
            {},
            {},
            "http://localhost:3000/user/id/" + friendsList[x],
        ));
    }

    const displayList = () => {
        let cards: JSX.Element[] = [];
        if (friendsList.length < 0) {
            return cards;
        }
        for (let x = 0; x < friendsList.length; x++) {
            cards.push(<UserCards key={x} user={fetchUser(x)} avatar={true} stat={false} />)
            x++;
        }
        return cards;
    }

    return <div>
                {displayList()}
            </div>
}
export default DisplayFriendsList;