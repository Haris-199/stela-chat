import request from "supertest";
import express, { Express } from "express";
import { postLogin, postRegister } from "./auth";
import { prisma } from "../db/client";

describe("POST /auth/login", () => {
  let app: Express;

  beforeAll(async () => {
    await prisma.user.create({
      data: {
        username: "Haris",
        password: "pass",
      },
    });
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { username: "Haris" } });
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.post("/", postLogin);
  });

  it("should sign in a user successfully", async () => {
    app.post("/register", postRegister);
    await request(app).post("/register").send({ username: "user", password: "pass" });

    const response = await request(app).post("/").send({ username: "user", password: "pass" });
    expect(response.status).toBe(200);
    expect(response.text).toContain("token");
    expect(response.body.message).toBe("Logged in successfully.");
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.username).toBe("user");
    expect(response.body.data.user.password).toBe(undefined);

    await prisma.user.delete({ where: { username: "user" } });
  });

  it("should handle wrong username", async () => {
    const response = await request(app).post("/").send({ username: "", password: "pass" });
    expect(response.status).toBe(400);
    expect(response.body.errors[0].message).toBe("Incorrect username or user does not exist.");
    expect(response.body.success).toBe(false);
  });

  it("should handle wrong password", async () => {
    const response = await request(app).post("/").send({ username: "Haris", password: "password" });
    expect(response.status).toBe(400);
    expect(response.body.errors[0].message).toBe("Incorrect password.");
    expect(response.body.success).toBe(false);
  });
});

describe("POST /auth/register", () => {
  let app: Express;

  afterAll(async () => {
    await prisma.user.delete({ where: { username: "Haris" } });
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.post("/", postRegister);
  });

  it("should register a user successfully", async () => {
    const response = await request(app).post("/").send({ username: "Haris", password: "pass" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User successfully created.");
    expect(response.body.success).toBe(true);
  });

  it("should handle a taken username", async () => {
    const response = await request(app).post("/").send({ username: "Haris", password: "pass" });
    expect(response.status).toBe(400);
    expect(response.body.errors[0].message).toBe("Username is taken.");
    expect(response.body.success).toBe(false);
  });

  it.todo("should handle password less than 8 characters");
  it.todo("should handle password without an uppercase letter");
  it.todo("should handle password without a lowercase letter");
  it.todo("should handle password without a digit");
  it.todo("should handle password without a special character");
});
