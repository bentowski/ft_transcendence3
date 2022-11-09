import IError from "../../interfaces/error-interface";
import {useAuthData} from "../../contexts/AuthProviderContext";
import {useEffect} from "react";
import {Alert} from "react-bootstrap";
import {useErrorContext} from "../../contexts/ErrorProviderContext";

const HandleError = () => {
    const { errorShow, errorMsg, errorCode, setError } = useErrorContext();

    const handleClose = () => {
        setError(null);
    }

    useEffect(() => {
        if (errorShow) {
            setTimeout(() => {
                handleClose();
            }, 2000)
        }
    }, [])

    return (
        <div>
            <Alert show={errorShow} onClose={handleClose} variant="warning" dismissible>{errorCode}: {errorMsg}</Alert>
        </div>
    )
}
export { HandleError };