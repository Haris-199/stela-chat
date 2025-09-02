import { io } from "socket.io-client";

export default function createSocket(token: string) {
  return io(import.meta.env.VITE_SERVER_URL, {
    autoConnect: false,
    auth: { token },
  });
}
