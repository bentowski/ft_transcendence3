import IChan from "./chan-interface";
import IHistory from "./history-interface";

export default interface IUser {
    user_id: string;
    auth_id: string;
    username: string;
    email: string;
    avatar: string;
    parties: IHistory[];
    game_won: number;
    game_lost: number;
    total_games: number;
    total_score: number;
    status: number;
    friends: IUser[];
    twoFASecret: string;
    isTwoFA: number;
    createdAt: Date;
    channelJoined: IChan[]
}