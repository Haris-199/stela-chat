const schedule = require("node-schedule");
const { PrismaClient } = require("../../prisma/generated/prisma");
const { parentPort } = require("worker_threads");

if (parentPort === null) {
  throw new Error("This module should be run as a worker thread");
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
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
});
