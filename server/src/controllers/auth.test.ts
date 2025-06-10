import request from "supertest";
import express, { Express } from "express";
import { postLogin } from "./auth";
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
    const response = await request(app)
      .post("/")
      .send({ username: "Haris", password: "pass" });

    expect(response.status).toBe(200);
    expect(response.text).toContain("token");
    expect(response.body.message).toBe("Logged in successfully.");
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.username).toBe("Haris");
    expect(response.body.data.user.password).toBe(undefined);
  });

  it("should handle wrong username", async () => {
    const response = await request(app)
      .post("/")
      .send({ username: "", password: "pass" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User not found.");
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBe(null);
  });

  it("should handle wrong password", async () => {
    const response = await request(app)
      .post("/")
      .send({ username: "Haris", password: "password" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Password does not match.");
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBe(null);
  });
});
