import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

// Unique email per run so tests do not collide with existing data
const email = `test_${Date.now()}@example.com`;
let token = "";

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Auth", () => {
  it("registers a new user and returns a token", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, password: "123456", name: "Test User" });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("rejects registering the same email twice", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, password: "123456" });
    expect(res.status).toBe(409);
  });

  it("logs in with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "123456" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "wrong" });
    expect(res.status).toBe(401);
  });
});

describe("Boards", () => {
  it("blocks access without a token", async () => {
    const res = await request(app).get("/api/boards");
    expect(res.status).toBe(401);
  });

  it("creates a board with three default columns", async () => {
    const res = await request(app)
      .post("/api/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "My Board" });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("My Board");
    expect(res.body.columns).toHaveLength(3);
  });

  it("lists the user boards", async () => {
    const res = await request(app)
      .get("/api/boards")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});