import {createContext, useContext, useMemo} from 'react';
import io, { Socket } from 'socket.io-client';

const socket = io('http://localhost:3000/update');
export const WebsocketContextUpdate = createContext<Socket>(socket);
export const WebsocketUpdateProvider = ({children}:{children:JSX.Element}) => {
    return <WebsocketContextUpdate.Provider value={socket}>{children}</WebsocketContextUpdate.Provider>;
}
