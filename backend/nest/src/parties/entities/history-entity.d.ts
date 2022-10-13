import UserEntity from '../../user/entities/user-entity';
export declare class HistoryEntity {
    game_id: bigint;
    user_one: string;
    user_two: string;
    final_score: string;
    winner: string;
    looser: string;
    createdAt: Date;
    users: UserEntity[];
}
