import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/client";

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await prisma.user.findMany({ select: { username: true } });
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully.",
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFriend(req: Request, res: Response, next: NextFunction) {
  try {
    const friends = await prisma.user.findMany({
      where: { id: req.user!.id },
      select: { friends: { select: { username: true } } },
    });
    res.status(200).json({
      success: true,
      message: "Friends retrieved successfully.",
      data: friends[0]?.friends,
    });
  } catch (error) {
    next(error);
  }
}
