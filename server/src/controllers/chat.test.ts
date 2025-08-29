import request from "supertest";
import express, { Express } from "express";
import { postChatMessages, postChats } from "./chat";
import { prisma } from "../db/client";
import validate from "../middleware/validate";
import {
  createChatSchema,
  createMessageBodySchema,
  createMessageParamsSchema,
} from "./chat.schema";
import { createUser } from "../utils/user";

describe("POST /api/chat/", () => {
  let app: Express;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    const u1 = await createUser("Haris", "pass");
    await createUser("Bilal", "pass");
    if (u1 !== undefined) {
      app.use("/", (req, res, next) => {
        req.user = {
          id: u1.id,
          username: u1.username,
          password: u1.password,
          createdAt: u1.createdAt,
          updatedAt: u1.updatedAt,
        };
        next();
      });
    }
    app.post("/", validate(createChatSchema), postChats);
  });

  afterEach(async () => {
    await prisma.chat.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it("should create a chat with valid data", async () => {
    const response = await request(app)
      .post("/")
      .send({
        name: "Test Chat",
        users: [{ username: "Bilal" }],
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Chat created successfully.");

    const chat = (await prisma.chat.findFirst({
      where: { name: "Test Chat" },
      include: { users: true },
    }))!;
    expect(chat).not.toBeNull();
    expect(chat.name).toBe("Test Chat");
    expect(chat.users.length).toBe(2);
    expect(chat.users.some((user) => user.username === "Haris")).toBe(true);
    expect(chat.users.some((user) => user.username === "Bilal")).toBe(true);
  });

  it("should handle empty chat name", async () => {
    const response = await request(app)
      .post("/")
      .send({
        name: "", // Invalid name
        users: [{ username: "Bilal" }],
      });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.name[0]).toBe("Empty chat name given.");
  });

  it("should handle empty user list", async () => {
    const response = await request(app).post("/").send({
      name: "Test Chat",
      users: [],
    });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.users[0]).toBe("At least one user must be selected.");
  });

  it("should handle empty usernames", async () => {
    const response = await request(app)
      .post("/")
      .send({
        name: "Test Chat",
        users: [{ username: "" }],
      });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.users[0]).toBe("Empty username given.");
  });

  it("should handle invalid usernames", async () => {
    const response = await request(app)
      .post("/")
      .send({
        name: "Test Chat",
        users: [{ username: "nonexistent" }],
      });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.users[0]).toBe('User with username "nonexistent" not found.');
  });

  it("should not allow adding self to chat", async () => {
    const response = await request(app)
      .post("/")
      .send({
        name: "Test Chat",
        users: [{ username: "Haris" }],
      });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.users[0]).toBe("You cannot add yourself to a chat.");
  });
});

describe("POST /api/chat/:chatId/message", () => {
  let app: Express;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    const u1 = await createUser("Haris", "pass");
    await createUser("Bilal", "pass");
    if (u1 !== undefined) {
      app.use("/", (req, res, next) => {
        req.user = {
          id: u1.id,
          username: u1.username,
          password: u1.password,
          createdAt: u1.createdAt,
          updatedAt: u1.updatedAt,
        };
        next();
      });
      await prisma.chat.create({
        data: {
          name: "Test Chat",
          users: { connect: [{ id: u1.id }, { username: "Bilal" }] },
        },
      });
    }
    app.post(
      "/:chatId/message",
      validate(createMessageBodySchema),
      validate(createMessageParamsSchema, "params"),
      postChatMessages,
    );
  });

  afterEach(async () => {
    await prisma.chat.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it("should create a message in chat with valid data", async () => {
    const chat = await prisma.chat.findFirst({ where: { name: "Test Chat" } });
    if (!chat) throw new Error("Chat not found");

    const response = await request(app).post(`/${chat.id}/message`).send({ text: "Hello, world!" });
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Text sent successfully.");

    const message = await prisma.message.findFirst({
      where: { chatId: chat.id },
      include: { sender: true },
    });
    expect(message).not.toBeNull();
    expect(message?.text).toBe("Hello, world!");
    expect(message?.sender.username).toBe("Haris");
  });

  it("should not allow empty messages", async () => {
    const response = await request(app).post("/1/message").send({ text: "" });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.text[0]).toBe("Empty text given.");
  });

  it("should not allow long messages", async () => {
    const response = await request(app)
      .post("/1/message")
      .send({ text: "a".repeat(256) });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.text[0]).toBe("Text is too long.");
  });

  it("should not allow invalid chat ids", async () => {
    const response = await request(app).post("/0/message").send({ text: "a" });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.chatId[0]).toBe("Invalid chat ID.");
  });

  it("should not allow non numeric chat ids", async () => {
    const response = await request(app).post("/abc/message").send({ text: "a" });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.chatId[0]).toContain("Expected number");
  });
});
