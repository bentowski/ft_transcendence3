import { useAuthData } from "../../contexts/AuthProviderContext";
import { Alert } from "react-bootstrap";
import { useEffect } from "react";
import {io} from "socket.io-client";
import {ErrorType} from "../../types";

const socket = io('http://localhost:3000/update')

const HandleError = (): JSX.Element => {
    const { errorShow, errorMsg, errorCode, setError } = useAuthData();

    useEffect((): void => {
        const close = (): void => {
            setError(null);
        }
        setInterval(close, 1800);
    }, [setError])

    useEffect(() => {
        const handleError = (error: ErrorType, auth_id: string) => {
            setError(error);
        }
        socket.on('error', handleError);
        return () => {
            socket.off('error', handleError);
        }
    }, [setError])

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
