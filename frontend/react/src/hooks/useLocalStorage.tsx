import {useState} from "react";
import Request from "../components/utils/Requests";

export const useLocalStorage = (keyName: any, defaultValue: any) => {
    const [storedValue, setStoredValue] = useState(async () => {
        try {
            //const value = window.localStorage.getItem(keyName);
            let value = await Request(
                "GET",
                {},
                {},
                "http://localhost:3000/auth/authenticated",
            )
            if (value) {
                return value;
            } else {
                return defaultValue;
            }
        } catch (err) {
            return defaultValue;
        }
    });
    const setValue = (newValue: any) => {
        setStoredValue(newValue);
    };
    return [storedValue, setValue];
}
