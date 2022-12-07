import {useEffect, useState} from "react";
import {useAuthData} from "../../contexts/AuthProviderContext";
import Request from "./Requests";
import UserCards from "./UserCards";
import {UserType} from "../../types";

const DisplayFriendsList = (): JSX.Element => {
    const { friendsList, setError } = useAuthData();
    const [result, setResult] = useState<JSX.Element[]>([]);

    const fetchUser = async (auth_id: string): Promise<UserType|undefined> => {
        try {
            const usr: UserType = await Request(
                "GET",
                {},
                {},
                "http://localhost:3000/user/id/" + auth_id,
            );
            return usr;
        } catch (error) {
            setError(error);
        }
    }

    useEffect((): void => {
        setResult([]);
        const getresults = async (): Promise<void> => {
            let cards: JSX.Element[] = [];
            for (let x: number = 0; x < friendsList.length; x++) {
                const usr: UserType | undefined = await fetchUser(friendsList[x]);
                if (usr) {
                    cards.push(<UserCards key={x} user={usr} avatar={true} stat={false} />)
                }
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