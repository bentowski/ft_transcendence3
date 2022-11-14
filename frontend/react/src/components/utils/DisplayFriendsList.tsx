import {useEffect, useState} from "react";
import {useAuthData} from "../../contexts/AuthProviderContext";
import Request from "./Requests";
import UserCards from "./UserCards";
import {UserType} from "../../types";

const DisplayFriendsList = () => {
    const { friendsList } = useAuthData();
    const [result, setResult] = useState<JSX.Element[]>([]);
    //const [loading, setLoading] = useState<boolean>(false);

    const fetchUser = async (auth_id: string) => {
        return await Request(
            "GET",
            {},
            {},
            "http://localhost:3000/user/id/" + auth_id,
        );
    }

    useEffect(() => {
        console.log('useffect hook engaged result    :=:  ', friendsList);
        //setLoading(true);
        const getresults = async () => {
            let cards: JSX.Element[] = [];
            if (friendsList.length < 0) {
                setResult(cards);
                return ;
            }
            for (let x = 0; x < friendsList.length; x++) {
                console.log('xxxx = ', x, 'friendslist = ', friendsList[x]);
                const usr: any = await fetchUser(friendsList[x]);
                cards.push(<UserCards key={x} user={usr} avatar={true} stat={false} />)
                x++;
            }
            setResult(cards);
            return ;
            //console.log('useffect hook disengaged', cards);
        }
        getresults();
    }, [friendsList])

    return <div>
                {
                    result
                }
            </div>
}
export default DisplayFriendsList;