import request from "supertest";
import express, { Express } from "express";
import { getHome } from "./home";

describe("GET /", () => {
  let app: Express;

  beforeEach(() => {
    app = express();
  });

  it("Should send hello world.", async () => {
    app.get("/", getHome);
    const response = await request(app).get("/");
    expect(response.text).toContain("Hello world.");
  });
  it("Should send status code 200.", async () => {
    app.get("/", getHome);
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });
  it("Should send json.", async () => {
    app.get("/", getHome);
    const response = await request(app).get("/");
    expect(response.type).toBe("application/json");
  });
});
