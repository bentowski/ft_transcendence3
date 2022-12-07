import { useAuthData } from "../../contexts/AuthProviderContext";
import { Alert } from "react-bootstrap";
import { useEffect } from "react";

const HandleError = (): JSX.Element => {
    const { errorShow, errorMsg, errorCode, setError } = useAuthData();

    useEffect((): void => {
        setInterval(handleClose, 1800);
    })

    const handleClose = (): void => {
        setError(null);
    }
    return (
        <div>
            <Alert className="globalError" show={errorShow} onClose={handleClose} variant="warning" dismissible>{errorCode}: {errorMsg}</Alert>
        </div>
    )
}
export { HandleError };
