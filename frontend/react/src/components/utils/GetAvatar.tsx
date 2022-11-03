import {Component} from "react";
import {AuthContext, useAuthData} from "../../contexts/AuthProviderContext";
import {Link} from "react-router-dom";

const GetAvatar = ({className, width, height, alt}:{className: string, width: string, height: string, alt: string}) => {
    const { user } = useAuthData();

    if (user)
    {
        return (
            <img className={className} width={width} height={height} src={user.avatar} alt={alt} />
        )
    }
    else
    {
        return (
                <div>Unknown</div>
        )
    }
}

export default GetAvatar;