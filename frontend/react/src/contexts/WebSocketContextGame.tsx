import { createContext } from 'react';
import io, { Socket } from 'socket.io-client';

export const socket = io('http://217.160.41.142:3000/game');
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;
