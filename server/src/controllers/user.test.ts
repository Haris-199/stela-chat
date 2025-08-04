import request from "supertest";
import express, { Express, NextFunction, Request, Response } from "express";
import { prisma } from "../db/client";
import validate from "../middleware/validate";
import { createUser, makeFriends } from "../utils/user";
import { postFriendRequest, putFriendRequest } from "./user";
import { acceptFriendRequestBodySchema, friendRequestParamsSchema, sendFriendRequestSchema } from "./user.schema";

describe("POST /api/user/friend/request", () => {
  let app: Express;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    
    const u1 = await createUser("Haris", "pass");
    await createUser("Bilal", "pass");
    await createUser("Yasir", "pass");
    if (u1 !== undefined) {
      makeFriends(u1.username, "Yasir");
      app.use("/", addMockUser(u1))
    };

    app.post("/", validate(sendFriendRequestSchema), postFriendRequest);
  });

  afterEach(async () => {
    await prisma.friendRequest.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it("should successfully send a friend request", async () => {
    const response = await request(app).post("/").send({ receiver: "Bilal" });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Friend request sent successfully.");

    const requestData = await prisma.friendRequest.findFirst({
      where: { receiver: { username: "Bilal" } },
      include: { sender: true },
    });
    expect(requestData).not.toBeNull();
    expect(requestData?.sender.username).toEqual("Haris");
  });

  it("should ignore empty receiver", async () => {
    const response = await request(app).post("/").send({ receiver: "" });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.receiver[0]).toBe("Receiver username can not be empty.");
  });

  it("should handle request sent to self", async () => {
    const response = await request(app).post("/").send({ receiver: "Haris" });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.receiver[0]).toBe("Can not send friend request to yourself.");
  });

  it("should handle non-existent users", async () => {
    const response = await request(app).post("/").send({ receiver: "NonExistentUser" });
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.receiver[0]).toBe("Receiver not found.");
  });

  it("should handle already sent requests", async () => {
    await request(app).post("/").send({ receiver: "Bilal" });
    const response = await request(app).post("/").send({ receiver: "Bilal" });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.receiver[0]).toBe("Request already exists.");
  });

  it("should handle non-existent users", async () => {
    const response = await request(app).post("/").send({ receiver: "NonExistentUser" });
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.receiver[0]).toBe("Receiver not found.");
  });
});

describe("PUT /api/user/friend/request/:id", () => {});

describe("DELETE /api/user/friend/request/:id", () => {});

describe("DELETE /api/user/friend/:username", () => {});

function addMockUser(user: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    req.user = {
      id: user.id,
      username: user.username,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    next();
  };
}
