import IMessage from "./message-interface";
import IUser from "./user-interface";

export default interface IChan {
    id: string;
    type: string;
    name: string;
    admin: Array<string>;
    topic: string;
    password: string;
    messages: IMessage[];
    chanUser: IUser[];
}