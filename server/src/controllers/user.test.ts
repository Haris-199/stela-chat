import request from "supertest";
import express, { Express, NextFunction, Request, Response } from "express";
import { prisma } from "../db/client";
import validate from "../middleware/validate";
import { createFriendRequest, createUser, makeFriends } from "../utils/user";
import { deleteFriend, deleteFriendRequest, postFriendRequest, putFriendRequest } from "./user";
import {
  acceptFriendRequestBodySchema,
  friendRequestParamsSchema,
  sendFriendRequestSchema,
  usernameParamsSchema,
} from "./user.schema";

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
      app.use("/", addMockUser(u1));
    }

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
});

describe("PUT /api/user/friend/request/:id", () => {
  let app: Express;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    const u1 = await createUser("Haris", "pass");
    await createUser("Bilal", "pass");
    await createUser("Yasir", "pass");
    if (u1 !== undefined) app.use("/", addMockUser(u1));
    app.put(
      "/:id",
      validate(acceptFriendRequestBodySchema),
      validate(friendRequestParamsSchema, "params"),
      putFriendRequest,
    );
  });

  afterEach(async () => {
    await prisma.friendRequest.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it("should handle friend request acceptance", async () => {
    const fr = await createFriendRequest("Bilal", "Haris");
    const response = await request(app).put(`/${fr.id}`).send({ sender: "Bilal" });
    expect(response.status).toBe(200);

    const friendRequest = await prisma.friendRequest.findFirst({
      where: { receiver: { username: "Haris" } },
    });
    expect(friendRequest).toBeNull();

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Friend request responded successfully.");
  });

  it("should handle empty sender", async () => {
    const response = await request(app).put("/1").send({ sender: "" });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.sender[0]).toBe("Sender username can not be empty.");
  });

  it("should handle non-existent sender", async () => {
    const fr = await createFriendRequest("Bilal", "Haris");
    const response = await request(app).put(`/${fr.id}`).send({ sender: "NonExistentUser" });
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.sender[0]).toBe("Sender not found.");
  });

  it("should handle non-existent friend requests", async () => {
    const fr = await createFriendRequest("Bilal", "Haris");
    const response = await request(app)
      .put(`/${fr.id + 10}`)
      .send({ sender: "Bilal" });
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.friendRequest[0]).toBe("Friend request not found.");
  });

  it("should handle invalid request id", async () => {
    const fr = await createFriendRequest("Bilal", "Yasir");
    const response = await request(app).put(`/${fr.id}`).send({ sender: "Bilal" });
    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.friendRequest[0]).toBe("Friend request is not valid.");
  });
});

describe("DELETE /api/user/friend/request/:id", () => {
  let app: Express;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    const u1 = await createUser("Haris", "pass");
    await createUser("Bilal", "pass");
    if (u1 !== undefined) app.use("/", addMockUser(u1));
    app.delete("/:id", validate(friendRequestParamsSchema, "params"), deleteFriendRequest);
  });

  afterEach(async () => {
    await prisma.friendRequest.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it("should successfully delete a friend request", async () => {
    const fr = await createFriendRequest("Bilal", "Haris");
    const response = await request(app).delete(`/${fr.id}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Friend request canceled successfully.");

    const deletedRequest = await prisma.friendRequest.findUnique({ where: { id: fr.id } });
    expect(deletedRequest).toBeNull();
  });

  it("should handle non-existent friend request", async () => {
    const fr = await createFriendRequest("Bilal", "Haris");
    const response = await request(app).delete(`/${fr.id + 10}`);
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.id[0]).toBe("Friend request not found.");
  });

  it("should handle invalid friend request id", async () => {
    const response = await request(app).delete("/invalid");
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.id[0]).toContain("Expected number");
  });

  it("should handle friend request id below 1", async () => {
    const response = await request(app).delete("/0");
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.id[0]).toBe("Invalid friend request ID.");
  });
});

describe("DELETE /api/user/friend/:username", () => {
  let app: Express;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    const u1 = await createUser("Haris", "pass");
    await createUser("Bilal", "pass");
    if (u1 !== undefined) app.use("/", addMockUser(u1));
    app.delete("/:username", validate(usernameParamsSchema, "params"), deleteFriend);
  });

  afterEach(async () => {
    await prisma.friendRequest.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it("should successfully delete a friend", async () => {
    await makeFriends("Haris", "Bilal");
    const response = await request(app).delete("/Bilal");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Friend removed successfully.");
  });

  it("should not accept self-deletion", async () => {
    const response = await request(app).delete("/Haris");
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.username[0]).toBe("Cannot remove yourself as a friend.");
  });

  it("should handle non-existent user", async () => {
    const response = await request(app).delete("/NonExistentUser");
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.username[0]).toBe("User with username \"NonExistentUser\" not found.");
  });

  it("should handle non-existent friend", async () => {
    const response = await request(app).delete("/Bilal");
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.username[0]).toBe("User \"Haris\" is not friends with \"Bilal\".");
  });
});

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
