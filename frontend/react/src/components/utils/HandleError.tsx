import IError from "../../interfaces/error-interface";
import {useAuthData} from "../../contexts/AuthProviderContext";
import {useEffect} from "react";
import {Alert} from "react-bootstrap";
import {useErrorContext} from "../../contexts/ErrorProviderContext";

const HandleError = ({err}:{err: any}) => {
    const { error, setError } = useErrorContext();

    console.log('error catched : ', err);

    const handleClose = () => {
        setError(false);
    }

    return (
        <div>
            <Alert onClose={handleClose} variant="warning" dismissible>{err}</Alert>
        </div>
    )
}
export { HandleError };