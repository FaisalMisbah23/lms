jest.mock("../utils/redis", () => ({
  redis: {
    get: jest.fn(() => Promise.resolve(null)),
    set: jest.fn(() => Promise.resolve("OK")),
    del: jest.fn(() => Promise.resolve(1)),
  },
}));

import request from "supertest";
import { app } from "../app";

describe("API smoke", () => {
  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("GET /test returns success", async () => {
    const res = await request(app).get("/test");
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("GET /api/v1/me without session returns error", async () => {
    const res = await request(app).get("/api/v1/me");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
