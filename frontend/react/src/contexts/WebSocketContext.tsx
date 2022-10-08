import { createContext } from 'react';
import socketio, { Socket } from 'socket.io-client';

export const socket = socketio('http://localhost:3000/chat');
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;