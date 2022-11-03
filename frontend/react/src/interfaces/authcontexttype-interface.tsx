import IUser from "./user-interface";

export default interface IAuthContextType {
  user: Promise<IUser>;
  isAuth: boolean;
  isLogin: boolean;
  isTwoFa: boolean;
  loading: boolean;
  error: boolean;
}
