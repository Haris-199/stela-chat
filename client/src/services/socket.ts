import { io } from "socket.io-client";

export default function createSocket(token: string) {
  return io(undefined, {
    autoConnect: false,
    auth: { token },
  });
}
