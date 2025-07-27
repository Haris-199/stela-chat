import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/client";
import { fr } from "zod/v4/locales";

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

export async function deleteFriend(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const user = req.user!;

    if (username === user.username) {
      res.status(400).json({
        success: false,
        message: "Cannot remove yourself as a friend.",
      });
      return;
    }

    const friend = await prisma.user.findUnique({
      where: { username },
      include: { friends: true },
    });

    if (friend === null) {
      res.status(400).json({
        success: false,
        message: `User with username "${username}" not found.`,
      });
      return;
    }

    if (!friend.friends.some((f) => f.id === user.id)) {
      res.status(400).json({
        success: false,
        message: `User "${user.username}" is not friends with "${username}".`,
      });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        friends: { disconnect: { id: friend.id } },
        friendOf: { disconnect: { id: friend.id } },
      },
    });

    res.status(200).json({
      success: true,
      message: "Friend removed successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export async function getFriendRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const requests = await prisma.friendRequest.findMany({
      where: { receiverId: req.user!.id },
      select: { id: true, sender: { select: { username: true } } },
    });
    res.status(200).json({
      success: true,
      message: "Incoming friend requests retrieved successfully.",
      data: requests.map((request) => ({ id: request.id, username: request.sender.username })),
    });
  } catch (error) {
    next(error);
  }
}

export async function postFriendRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { receiver } = req.body;

    if (receiver === req.user!.username) {
      res.status(400).json({ success: false, message: "Can not send friend request to yourself." });
      return;
    }

    const recipient = await prisma.user.findUnique({
      where: { username: receiver },
      include: { friends: true },
    });

    if (recipient === null) {
      res.status(404).json({ success: false, message: "Receiver not found." });
      return;
    }

    if (recipient.friends.some((friend) => friend.username === req.user!.username)) {
      res.status(400).json({
        success: false,
        message: `User is already friends with "${receiver}".`,
      });
      return;
    }

    const existing = await prisma.friendRequest.findFirst({
      where: { senderId: req.user!.id, receiver: { username: receiver } },
    });

    if (existing !== null) {
      res.status(400).json({ success: false, message: "Request already exists." });
      return;
    }

    await prisma.friendRequest.create({
      data: {
        sender: { connect: { id: req.user!.id } },
        receiver: { connect: { username: receiver } },
      },
    });

    res.status(201).json({
      success: true,
      message: "Friend request sent successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export async function putFriendRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const receiver = req.user!;
    const id = +req.params.id; // Id of the friend request to respond to
    const { sender } = req.body;

    const senderUser = await prisma.user.findUnique({
      where: { username: sender },
      include: { sentFriendRequests: { where: { id }, take: 1 } },
    });

    if (senderUser === null) {
      res.status(404).json({
        success: false,
        message: "Sender not found.",
      });
      return;
    }

    if (senderUser.sentFriendRequests.length === 0) {
      res.status(404).json({
        success: false,
        message: "Friend request not found.",
      });
      return;
    }

    if (senderUser.sentFriendRequests[0].receiverId !== receiver.id) {
      res.status(422).json({
        success: false,
        message: "Friend request is not valid.",
      });
      return;
    }

    const otherRequest = await prisma.friendRequest.findFirst({
      where: { AND: [{ receiverId: senderUser.id }, { senderId: receiver.id }] },
    });

    await Promise.all([
      prisma.friendRequest.delete({ where: { id } }),
      prisma.user.update({
        where: { username: receiver.username },
        data: {
          friends: { connect: { username: sender } },
          friendOf: { connect: { username: sender } },
        },
      }),
      otherRequest !== null && prisma.friendRequest.delete({ where: { id: otherRequest.id } }),
    ]);

    res.status(200).json({
      success: true,
      message: "Friend request responded successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteFriendRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const id = +req.params.id;
    const user = req.user!;

    const request = await prisma.friendRequest.findUnique({ where: { id } });

    if (request === null || request.receiverId !== user.id) {
      res.status(404).json({
        success: false,
        message: "Friend request not found.",
      });
      return;
    }

    await prisma.friendRequest.delete({ where: { id } });
    res.status(200).json({
      success: true,
      message: "Friend request canceled successfully.",
    });
  } catch (error) {
    next(error);
  }
}
