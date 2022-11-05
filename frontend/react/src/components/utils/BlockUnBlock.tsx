import {useEffect, useState} from "react";
import {useAuthData} from "../../contexts/AuthProviderContext";
import Request from './Requests';
import {useLocation, useNavigate} from "react-router-dom";

const BlockUnBlock = ({auth_id}:{auth_id:string}) => {
    const [status, setStatus] = useState(false);
    const { user } = useAuthData();
    const navigate = useNavigate();
    const location = useLocation();

    const getStatus = async () => {
        try {
            let res = await Request(
                "GET",
                {},
                {},
                "http://localhost:3000/user/" + user.auth_id + "/getblocked",
            )
            if (res) {
                //console.log('data = ', res);
                for (let index = 0; index < res.length; index++) {
                    if (res[index].auth_id === auth_id) {
                        setStatus(true);
                        navigate(location);
                        return ;
                    }
                }
                setStatus(false);
                navigate(location);
                return ;
            } else {
                setStatus(false);
                return ;
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getStatus();
    }, [])

    const blockunblockUser = async () => {
        let action: boolean = true;
        if (status) {
            action = false;
        }
        try {
            let res = await fetch("http://localhost:3000/user/updateblocked", {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ auth_id: auth_id, action: action }),
            })
            if (res.ok) {
                //console.log('request succeed!');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <button onClick={blockunblockUser} >
            { status ?
            <p>UNBLOCK</p>
            :
            <p>BLOCK</p> }
        </button>
    )
}
export default BlockUnBlock;