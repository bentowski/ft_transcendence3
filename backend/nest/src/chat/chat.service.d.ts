import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
export declare class ChatService {
    private chatRepository;
    constructor(chatRepository: Repository<Chat>);
    createMessage(chat: Chat): Promise<Chat>;
    getMessages(): Promise<Chat[]>;
}
