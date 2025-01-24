import { describe, expect, test, beforeAll } from "bun:test";
import * as journals from "../src/lib";
import db from "../src/db";

describe("Journals Lib", () => {
  beforeAll(async () => {
    // Clean the database before tests
    await db`DELETE FROM journals`;
  });

  test("should create a journal entry", async () => {
    const data = {
      reference: "INV-001",
      account_number: "TEST123",
      date: "2024-03-15",
      amount: 100.5,
      currency: "USD",
    };

    const journal = await journals.createJournal(data);
    expect(journal).toMatchObject({
      reference: data.reference,
      account_number: data.account_number,
      amount: data.amount.toString(),
      currency: data.currency,
    });
    expect(new Date(journal.date).toISOString().split("T")[0]).toBe(data.date);
    expect(journal.id).toBeDefined();
    expect(journal.created_at).toBeDefined();
    expect(journal.updated_at).toBeDefined();
  });

  test("should list journal entries", async () => {
    const data = {
      reference: "INV-002",
      account_number: "TEST123",
      date: "2024-03-16",
      amount: 200.75,
      currency: "EUR",
    };

    await journals.createJournal(data);
    const journalList = await journals.listJournals();

    expect(journalList.length).toBeGreaterThan(0);
    expect(journalList[0]).toHaveProperty("id");
    expect(journalList[0]).toHaveProperty("reference");
    expect(journalList[0]).toHaveProperty("amount");
  });

  test("should get journal by id", async () => {
    const data = {
      reference: "INV-003",
      account_number: "TEST123",
      date: "2024-03-17",
      amount: 300.25,
      currency: "GBP",
    };

    const created = await journals.createJournal(data);
    const journal = await journals.getJournal(created.id.toString());

    expect(journal).toMatchObject({
      reference: data.reference,
      account_number: data.account_number,
      amount: data.amount.toString(),
      currency: data.currency,
    });
    expect(new Date(journal.date).toISOString().split("T")[0]).toBe(data.date);
  });

  test("should update journal", async () => {
    const data = {
      reference: "INV-004",
      account_number: "TEST123",
      date: "2024-03-18",
      amount: 400.0,
      currency: "JPY",
    };

    const created = await journals.createJournal(data);
    const updateData = {
      reference: "INV-004-UPDATED",
      account_number: "TEST123",
      date: data.date,
      amount: 450.0,
      currency: data.currency,
    };

    const updated = await journals.updateJournal(
      created.id.toString(),
      updateData
    );

    expect(updated.reference).toBe(updateData.reference);
    expect(updated.amount).toBe(updateData.amount.toString());
  });

  test("should delete journal", async () => {
    const data = {
      reference: "INV-005",
      account_number: "TEST123",
      date: "2024-03-19",
      amount: 500.0,
      currency: "CAD",
    };

    const created = await journals.createJournal(data);
    const deleted = await journals.deleteJournal(created.id.toString());

    expect(deleted).toBe(true);

    const journal = await journals.getJournal(created.id.toString());
    expect(journal).toBeUndefined();
  });

  test("should fail with invalid data", async () => {
    const invalidData = {
      reference: "", // Invalid: empty string
      account_number: "TEST123",
      date: "invalid-date", // Invalid date format
      amount: "not-a-number", // Invalid amount
      currency: "INVALID", // Invalid currency length
    };

    await expect(journals.createJournal(invalidData)).rejects.toThrow();
  });
});
