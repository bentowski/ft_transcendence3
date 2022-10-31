import {useAuthData} from "../contexts/AuthProviderContext";

const useUsername = () => {
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
            'Unknown'
        )
    }
}

export default useUsername;