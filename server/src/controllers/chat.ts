import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/client";

export async function getChats(req: Request, res: Response, next: NextFunction) {
  const user = req.user as any;
  try {
    const chats = await prisma.chat.findMany({
      where: { users: { some: { id: user.id } } },
      include: { users: { select: { username: true } } },
    });
    res.status(200).json({
      success: true,
      message: `${user.username}'s chats retrieved successfully.`,
      data: chats,
    });
  } catch (error) {
    next(error);
  }
}

export async function getChatMessages(req: Request, res: Response, next: NextFunction) {
  const { chatId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { chatId: +chatId },
      include: { sender: { select: { username: true } } },
    });
    res.status(200).json({
      success: true,
      message: "Messages retrieved successfully.",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
}
