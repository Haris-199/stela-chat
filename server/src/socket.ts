import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { prisma } from "./db/client";
import "dotenv/config";

export function setupSocket(
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
) {
  const allowedOrigins = [
    process.env.CLIENT_URL || "http://localhost:5173",
    "https://stela-chat.onrender.com",
    "http://stela-chat.onrender.com",
  ];
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const { token } = socket.handshake.auth;
    if (!token) return next(new Error("Authentication error"));
    const tokenData = jwt.verify(token, process.env.JWT_KEY as string);
    if (!tokenData) return next(new Error("Authentication error"));
    next();
  });

  io.on("connection", (socket) => {
    const tokenData = jwt.verify(socket.handshake.auth.token, process.env.JWT_KEY as string);

    socket.on("joinChat", (chatId) => {
      prisma.chat
        .findUnique({ where: { id: chatId }, include: { users: true } })
        .then((chat) => {
          // @ts-ignore
          if (chat && chat.users.some((user) => user.id === tokenData.id)) {
            socket.join(chatId);
          } else {
            socket.disconnect();
          }
        })
        .catch((err) => {
          console.error("Error finding chat: ", err);
          socket.disconnect();
        });
    });

    socket.on("sendMessage", (chatId, message) => {
      socket.to(chatId).emit("receiveMessage", { sender: socket.id, message });
    });

    socket.on("disconnect", () => {});
  });

  return io;
}
