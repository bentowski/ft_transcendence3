import {useEffect, useState} from "react";
import {useAuthData} from "../../contexts/AuthProviderContext";
import Request from './Requests';
import {useLocation, useNavigate} from "react-router-dom";

const BlockUnBlock = ({auth_id}:{auth_id:string}) => {
    const [status, setStatus] = useState(false);
    const [butt, setButt] = useState(false);
    const { user } = useAuthData();
    const navigate = useNavigate();
    const location = useLocation();

    const updateStatus = async () => {
        try {
            let res = await Request(
                "GET",
                {},
                {},
                "http://localhost:3000/user/" + auth_id + "/isblocked",
            )
            //if (res) {
                //console.log('data = ', res);
                setStatus(res);
                //navigate(location);
                //return ;
            //} else {
                //setStatus(false);
                return ;
            //}
        } catch (error) {
            //afficher un modal ici
            //res.statusCode
            //res.message
        }
    }

    useEffect(() => {
        updateStatus();
        //console.log('status = ', status);
        if (status) {
            setButt(true);
        } else {
            setButt(false);
        }
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
                setButt(action);
                setStatus(action);
                //console.log('request succeed!');
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <button onClick={blockunblockUser} >
            { butt ?
            <p>UNBLOCK</p>
            :
            <p>BLOCK</p> }
        </button>
    )
}
export default BlockUnBlock;