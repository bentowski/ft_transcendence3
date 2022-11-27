import {useAuthData} from "../../contexts/AuthProviderContext";
import {Alert} from "react-bootstrap";

const HandleError = () => {
    const { errorShow, errorMsg, errorCode, setError } = useAuthData();
    const handleClose = () => {
        setError(null);
    }
    return (
        <div>
            <Alert className="globalError" show={errorShow} onClose={handleClose} variant="warning" dismissible>{errorCode}: {errorMsg}</Alert>
        </div>
    )
}
export { HandleError };
