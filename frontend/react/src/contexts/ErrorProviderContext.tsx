import {createContext, ReactNode} from "react";


export const ErrorContext = createContext<any>({
});

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
/*
    const [errorShow, setErrorShow] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [errorCode, setErrorCode] = useState<number>(0);
    //const [error, setError] = useState<any>(false)''
    //const location = useLocation();


    useEffect(() => {
        console.log('error = ', errorShow);
        if (errorShow === true) {
            console.log('an error happenend, gonna display it!')
        }
    }, [])


    const setError = (value: any) => {
        //console.log('error value = ', value);
        if (value) {
            setErrorShow(true);
            setErrorMsg(value.message);
            setErrorCode(value.statusCode);
        } else {
            setErrorShow(false);
            setErrorMsg('');
            setErrorCode(0);
        }
    }

    const contextValue = {
        errorMsg,
        errorCode,
        errorShow,
        setError: useCallback((value: any) => setError(value), [])
    };

    return (
        <ErrorContext.Provider value={contextValue}>{children}</ErrorContext.Provider>
    );
    */
}

export const useErrorContext = () => {
    /*
    const context = useContext(ErrorContext);
    if (context === undefined) {
        throw new Error("useUserContext was used outside of its Provider");
    }
    return context;
     */
};
