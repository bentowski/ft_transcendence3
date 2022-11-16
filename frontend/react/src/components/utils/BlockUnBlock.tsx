import {useEffect, useState} from "react";
import {useAuthData} from "../../contexts/AuthProviderContext";
import Request from './Requests';
//import {useLocation, useNavigate} from "react-router-dom";

const BlockUnBlock = ({ auth_id }:{ auth_id : string }) => {
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, updateBlockedList } = useAuthData();
    //const navigate = useNavigate();
    //const location = useLocation();

    const updateStatus = async () => {
        //console.log('auth_id requestttt - ', auth_id);
        setLoading(true)
        try {
            let res = await Request(
                "GET",
                {},
                {},
                "http://localhost:3000/user/" + auth_id + "/isblocked",
            )
            //console.log('res = ', res);
            setStatus(res);
            setLoading(false);
            return ;
        } catch (error) {
            console.log(error);
            setLoading(false);
            //setLoading(true);
        }
    }

    useEffect(() => {
        if (auth_id !== undefined) {
            updateStatus();
            //console.log('status = ', status);
        }
    }, [auth_id])

    const blockunblockUser = async () => {
        //let action: boolean = true;
        //if (status) {
        //    action = false;
        //}
        try {
            let res = await fetch("http://localhost:3000/user/updateblocked", {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ auth_id: auth_id, action: !status}),
            })
            if (res.ok) {
                setStatus((prevState: any) => !prevState);
                updateBlockedList(user, !status);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <button onClick={blockunblockUser} >
                { loading && <p></p>}
                { status ?
                <p>UNBLOCK</p>
                :
                <p>BLOCK</p> }
            </button>
        </div>
    )
}
export default BlockUnBlock;