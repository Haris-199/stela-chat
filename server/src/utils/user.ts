import { prisma } from "../db/client";
import bcrypt from "bcryptjs";

export async function createUser(username: string, password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword!,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

export async function makeFriends(username1: string, username2: string) {
  return await prisma.user.update({
    where: { username: username1 },
    data: {
      friends: { connect: { username: username2 } },
      friendOf: { connect: { username: username2 } },
    },
  });
}

export async function deleteUser(username: string) {
  return await prisma.user.delete({ where: { username } });
}
