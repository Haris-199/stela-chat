import { io } from "socket.io-client"; // this changed test this

const token = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user") as string).token
  : "";

const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:3000", {
  autoConnect: false,
  auth: { token },
});

export default socket;
