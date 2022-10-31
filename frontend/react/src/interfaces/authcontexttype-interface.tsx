import IUser from "./user-interface";

export default interface IAuthContextType {
    user: Promise<IUser>;
    logout: () => void;
    validateTwoFa: (code: any) => void;
    //login: () => void;
    activateTwoFa: () => void;
    deactivateTwoFa: () => void;
    isAuth: boolean;
    isLogin: boolean;
    isTwoFa: boolean;
    loading: boolean;
    error: boolean;
    //over: boolean;
}
