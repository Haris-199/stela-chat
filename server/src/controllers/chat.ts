import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/client";

export async function getChats(req: Request, res: Response, next: NextFunction) {
  const user = req.user!;

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

export async function postChats(req: Request, res: Response, next: NextFunction) {
  const user = req.user!;
  const { name, users } = req.body;

  const userChecks = await Promise.all(
    users.map((u: { username: string }) =>
      prisma.user.findUnique({ where: { username: u.username } }),
    ),
  );

  for (let i = 0; i < userChecks.length; i++) {
    const u = userChecks[i];
    if (u === null) {
      res.status(400).json({
        success: false,
        errors: { users: [`User with username "${users[i].username}" not found.`] },
      });
      return;
    } else if (u.username === user.username) {
      res.status(400).json({
        success: false,
        errors: { users: ["You cannot add yourself to a chat."] },
      });
      return;
    }
  }

  try {
    await prisma.chat.create({
      data: {
        name,
        users: { connect: [user, ...users] },
      },
    });
    res.status(201).json({
      success: true,
      message: "Chat created successfully.",
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

export async function postChatMessages(req: Request, res: Response, next: NextFunction) {
  const { chatId } = req.params;
  const { message } = req.body;
  const user = req.user!;

  try {
    await prisma.message.create({
      data: {
        text: message,
        chatId: +chatId,
        userId: user.id,
      },
    });
    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    next(error);
  }
}
