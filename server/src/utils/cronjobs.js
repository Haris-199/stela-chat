const schedule = require("node-schedule");
const { PrismaClient } = require("../../prisma/generated/prisma");
const { parentPort } = require("worker_threads");

if (parentPort === null) {
  throw new Error("This module should be run as a worker thread.");
}

const databaseUrl =
  process.env.NODE_ENV === "test" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;
const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });

if (databaseUrl === undefined) {
  throw new Error("DATABASE_URL or TEST_DATABASE_URL must be set in environment variables.");
}

const every = {
  minute: "* * * * *",
  hour: "0 * * * *",
  day: "0 0 * * *",
};

schedule.scheduleJob(every.hour, async () => {
  try {
    const date = new Date();
    parentPort.postMessage(
      `[Guest Cleanup] Running guest cleanup at ${date.toLocaleDateString()} ${date.toLocaleTimeString()}...`,
    );
    const { count } = await prisma.user.deleteMany({ where: { guestExpiry: { lt: date } } });
    parentPort.postMessage(
      `[Guest Cleanup] Deleted ${count} expired guest${count === 1 ? "" : "s"} in ${
        Date.now() - date.getTime()
      }ms`,
    );
  } finally {
    await prisma.$disconnect();
  }
});

schedule.scheduleJob(every.day, async () => {
  try {
    const date = new Date();
    parentPort.postMessage(
      `[Chat Cleanup] Running chat cleanup at ${date.toLocaleDateString()} ${date.toLocaleTimeString()}...`,
    );

    const chats = await prisma.chat.findMany({ include: { users: true } });

    const chatsWithLowUsers = chats.reduce((acc, chat) => {
      if (chat.users.length < 2) return [...acc, chat.id];
      return acc;
    }, []);

    let count = 0;
    if (chatsWithLowUsers.length > 0) {
      const del = await prisma.chat.deleteMany({ where: { id: { in: chatsWithLowUsers } } });
      count = del.count;
    }

    parentPort.postMessage(
      `[Chat Cleanup] Deleted ${count} chat${count === 1 ? "" : "s"} with less than 2 users in ${
        Date.now() - date.getTime()
      }ms`,
    );
  } finally {
    await prisma.$disconnect();
  }
});
