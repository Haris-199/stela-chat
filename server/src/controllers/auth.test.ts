import request from "supertest";
import express, { Express } from "express";
import { postLogin, postRegister } from "./auth";
import { prisma } from "../db/client";
import validate from "../middleware/validate";
import { loginSchema, registerSchema } from "./auth.schema";
import { createUser } from "../utils/user";

describe("POST /api/auth/login", () => {
  let app: Express;

  beforeAll(async () => {
    await createUser("Haris", "pass");
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { username: "Haris" } });
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.post("/", validate(loginSchema), postLogin);
  });

  it("should sign in a user successfully", async () => {
    const response = await request(app).post("/").send({ username: "Haris", password: "pass" });
    expect(response.status).toBe(200);
    expect(response.text).toContain("token");
    expect(response.body.message).toBe("Logged in successfully.");
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.username).toBe("Haris");
    expect(response.body.data.user.password).toBe(undefined);

  });

  it("should handle wrong username", async () => {
    const response = await request(app).post("/").send({ username: "h", password: "pass" });
    expect(response.status).toBe(400);
    expect(response.body.errors.username[0]).toBe("Incorrect username or user does not exist.");
    expect(response.body.success).toBe(false);
  });

  it("should handle empty username", async () => {
    const response = await request(app).post("/").send({ username: "", password: "pass" });
    expect(response.status).toBe(400);
    expect(response.body.errors.username[0]).toBe("Username is required.");
    expect(response.body.success).toBe(false);
  });

  it("should handle wrong password", async () => {
    const response = await request(app).post("/").send({ username: "Haris", password: "password" });
    expect(response.status).toBe(400);
    expect(response.body.errors.password[0]).toBe("Incorrect password.");
    expect(response.body.success).toBe(false);
  });

  it("should handle empty password", async () => {
    const response = await request(app).post("/").send({ username: "Haris", password: "" });
    expect(response.status).toBe(400);
    expect(response.body.errors.password[0]).toBe("Password is required.");
    expect(response.body.success).toBe(false);
  });
});

describe("POST /api/auth/register", () => {
  let app: Express;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.post("/", validate(registerSchema), postRegister);
    await createUser("Haris", "pass");
  });

  afterEach(async () => {
    await prisma.user.delete({ where: { username: "Haris" } });
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { username: "user" } });
  });

  it("should register a user successfully", async () => {
    const response = await request(app).post("/").send({ username: "user", password: "Password1!", confirmPassword: "Password1!" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User successfully created.");
    expect(response.body.success).toBe(true);
  });

  it("should handle a taken username", async () => {
    const response = await request(app).post("/").send({ username: "Haris", password: "Password1!", confirmPassword: "Password1!" });
    expect(response.status).toBe(400);
    expect(response.body.errors.username[0]).toBe("Username is taken.");
    expect(response.body.success).toBe(false);
  });

  it("should handle empty username", async () => {
    const response = await request(app).post("/").send({ username: "", password: "pass", confirmPassword: "pass" });
    expect(response.status).toBe(400);
    expect(response.body.errors.username[0]).toBe("Username is required.");
    expect(response.body.success).toBe(false);
  });

  it("should handle password less than 8 characters", async () => {
    const response = await request(app).post("/").send({ username: "Haris", password: "short", confirmPassword: "short" });
    expect(response.status).toBe(400);
    expect(response.body.errors.password[0]).toBe("Password must be at least 8 characters long.");
    expect(response.body.success).toBe(false);
  });

  it("should handle password without an uppercase letter", async () => {
    const response = await request(app)
      .post("/")
      .send({ username: "Haris", password: "lowercase_1", confirmPassword: "lowercase_1" });
    expect(response.status).toBe(400);
    expect(response.body.errors.password[0]).toBe(
      "Password must contain at least one uppercase letter.",
    );
    expect(response.body.success).toBe(false);
  });

  it("should handle password without a lowercase letter", async () => {
    const response = await request(app)
      .post("/")
      .send({ username: "Haris", password: "UPPERCASE_1", confirmPassword: "UPPERCASE_1" });
    expect(response.status).toBe(400);
    expect(response.body.errors.password[0]).toBe(
      "Password must contain at least one lowercase letter.",
    );
    expect(response.body.success).toBe(false);
  });

  it("should handle password without a digit", async () => {
    const response = await request(app).post("/").send({ username: "Haris", password: "NoDigit!", confirmPassword: "NoDigit!" });
    expect(response.status).toBe(400);
    expect(response.body.errors.password[0]).toBe("Password must contain at least one number.");
    expect(response.body.success).toBe(false);
  });

  it("should handle password without a special character", async () => {
    const response = await request(app)
      .post("/")
      .send({ username: "Haris", password: "9ineChars", confirmPassword: "9ineChars" });
    expect(response.status).toBe(400);
    expect(response.body.errors.password[0]).toBe(
      "Password must contain at least one special character.",
    );
    expect(response.body.success).toBe(false);
  });

  it("should handle passwords that do not match", async () => {
    const response = await request(app)
      .post("/")
      .send({ username: "Haris", password: "Password1!", confirmPassword: "" });
    expect(response.status).toBe(400);
    expect(response.body.errors.confirmPassword[0]).toBe("Passwords must match.");
    expect(response.body.success).toBe(false);
  });
});
