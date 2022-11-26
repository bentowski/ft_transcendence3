import {useEffect, useState} from "react";
import {useAuthData} from "../../contexts/AuthProviderContext";
import Request from "./Requests";
import UserCards from "./UserCards";

const DisplayFriendsList = () => {
    const { friendsList, setError } = useAuthData();
    const [result, setResult] = useState<JSX.Element[]>([]);

    const fetchUser = async (auth_id: string) => {
        try {
            let user: any = await Request(
                "GET",
                {},
                {},
                "http://localhost:3000/user/id/" + auth_id,
            );
            return user;
        } catch (error) {
            setError(error);
        }
    }

    useEffect(() => {
        setResult([]);
        const getresults = async () => {
            let cards: JSX.Element[] = [];
            for (let x = 0; x < friendsList.length; x++) {
                const usr: any = await fetchUser(friendsList[x]);
                cards.push(<UserCards key={x} user={usr} avatar={true} stat={false} />)
            }
            setResult(cards);
            return ;
        }
        getresults();
    }, [friendsList])

    return <div>
                {result}
           </div>
}
export default DisplayFriendsList;