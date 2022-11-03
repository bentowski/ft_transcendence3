import { useAuthData } from "../../contexts/AuthProviderContext";

const GetUsername = () => {
    const { user } = useAuthData();

    if (user)
    {
        return (
                user.username
        )
    }
    else
    {
        return (
            <div>Unknown</div>
        )
    }
}

export default GetUsername;
