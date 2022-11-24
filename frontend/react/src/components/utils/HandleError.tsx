import IError from "../../interfaces/error-interface";
import {useAuthData} from "../../contexts/AuthProviderContext";
import {useEffect} from "react";
import {Alert} from "react-bootstrap";
import {useErrorContext} from "../../contexts/ErrorProviderContext";

const HandleError = () => {
    const { errorShow, errorMsg, errorCode, setError } = useAuthData();

    //console.log('errorshow = ', errorShow, ', errorMsg = ', errorMsg, ', errorCode = ', errorCode);

    const handleClose = () => {
        setError(null);
    }

    useEffect(() => {
            //
    }, [])

    return (
        <div>
            <Alert className="globalError" show={errorShow} onClose={handleClose} variant="warning" dismissible>{errorCode}: {errorMsg}</Alert>
        </div>
    )
}
export { HandleError };