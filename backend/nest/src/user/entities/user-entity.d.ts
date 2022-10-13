import { HistoryEntity } from '../../parties/entities/history-entity';
import { ProfileEntity } from './profile-entity';
export declare class UserEntity {
    user_id: string;
    auth_id: string;
    username: string;
    email: string;
    secret: string;
    avatar: string;
    parties: HistoryEntity[];
    game_won: number;
    game_lost: number;
    total_games: number;
    total_score: number;
    status: number;
    friends: UserEntity[];
    profile: ProfileEntity;
    authStrategy: string;
    createdAt: Date;
    constructor(partial: Partial<UserEntity>);
}
export default UserEntity;
