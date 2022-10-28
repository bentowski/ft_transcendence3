import IUser from "./user-interface";

export default interface IAuthContextType {
    user: any; /*Promise<IUser> | undefined;*/
    logout: () => void;
    isAuth: boolean;
    loading: boolean;
    over: boolean;
}
