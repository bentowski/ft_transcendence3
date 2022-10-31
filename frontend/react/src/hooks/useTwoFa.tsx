import {useAuthData} from "../contexts/AuthProviderContext";

const useTwoFa = () => {
    const { isTwoFa } = useAuthData();

    return (isTwoFa);
}
export default useTwoFa;