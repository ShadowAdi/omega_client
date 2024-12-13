import { createContext, ReactNode, useContext } from "react";
import { io, Socket } from "socket.io-client";

// Define the type for the context
type SocketContextType = {
  socket: Socket;
};

// Create the context with proper typing
export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = io("http://localhost:9000");

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
