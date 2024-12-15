import { io } from "socket.io-client";

export const socket = io("https://omega-server-k372.onrender.com", {
  withCredentials: true,
});