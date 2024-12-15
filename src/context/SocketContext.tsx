import { io } from "socket.io-client";

export const socket = io("https://server-omega-pi.vercel.app", {
  withCredentials: true,
});
