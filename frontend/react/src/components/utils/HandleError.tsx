import {useAuthData} from "../../contexts/AuthProviderContext";
import {useEffect} from "react";
import {Alert} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const HandleError = () => {
    const { user, errorShow, errorMsg, errorCode, setError } = useAuthData();
    const navigate = useNavigate();

    //console.log('errorshow = ', errorShow, ', errorMsg = ', errorMsg, ', errorCode = ', errorCode);

    const handleClose = () => {
        setError(null);
    }

    /*
    if (errorCode === 404) {
        navigate("/profile/" + user.username);
    }
     */

    return (
        <div>
            <Alert className="globalError" show={errorShow} onClose={handleClose} variant="warning" dismissible>{errorCode}: {errorMsg}</Alert>
        </div>
    )
}
export { HandleError };