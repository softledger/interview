import { describe, expect, test, beforeAll } from "bun:test";
import { app } from "../src/app";
import db from "../src/db";

describe("Journal Routes", () => {
  beforeAll(async () => {
    await db`DELETE FROM journals`;
  });

  test("should create journal via POST /journals", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/journals",
      payload: {
        reference: "ROUTE-001",
        account_number: "TEST123",
        date: "2024-03-15",
        amount: 100.5,
        currency: "USD",
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.reference).toBe("ROUTE-001");
    expect(body.id).toBeDefined();
  });

  test("should return 400 for invalid journal data", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/journals",
      payload: {
        reference: "", // Invalid: empty string
        account_number: "TEST123",
        date: "invalid-date",
        amount: "not-a-number",
        currency: "INVALID",
      },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toBe("Validation error");
  });

  test("should return 404 for non-existent journal", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/journals/99999",
    });

    expect(response.statusCode).toBe(404);
    const body = JSON.parse(response.body);
    expect(body.error).toBe("Journal not found");
  });

  test("should list journals via GET /journals", async () => {
    // Create test journal first
    await app.inject({
      method: "POST",
      url: "/journals",
      payload: {
        reference: "LIST-001",
        account_number: "TEST123",
        date: "2024-03-15",
        amount: 300.5,
        currency: "GBP",
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/journals",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });
});
