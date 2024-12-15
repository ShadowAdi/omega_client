import { io } from "socket.io-client";

export const socket = io("https://omega-server-rouge.vercel.app", {
  withCredentials: true,
});
