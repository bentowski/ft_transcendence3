import IUser from "./user-interface";

export default interface IHistory {
    game_id: bigint;
    user_one: string;
    user_two: string;
    score_one: number;
    score_two: number;
    createdAt: Date;
    users: IUser[];
}