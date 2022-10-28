import {Component} from "react";
import {AuthContext, useAuthData} from "../../contexts/AuthProviderContext";
import {Link} from "react-router-dom";

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