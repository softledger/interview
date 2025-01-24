import { expect, test, describe } from "bun:test";
import { consolidateBalances } from "../consolidation";
import type { Entity, JournalEntry, ExchangeRate } from "../types";

describe("consolidateBalances", () => {
  test("should consolidate journal entries correctly", () => {
    const entities: Entity[] = [
      {
        id: "parent-corp",
        currency: "USD",
        ParentId: "",
      },
      {
        id: "euro-subsidiary",
        currency: "EUR",
        ParentId: "parent-corp",
      },
      {
        id: "uk-subsidiary",
        currency: "GBP",
        ParentId: "parent-corp",
      },
    ];

    const journals: JournalEntry[] = [
      {
        id: "j1",
        date: new Date("2024-01-23"),
        reference: "CASH-001",
        accountNumber: "1000",
        amount: 1000,
        EntityId: "parent-corp",
      },
      {
        id: "j2",
        date: new Date("2024-01-23"),
        reference: "CASH-002",
        accountNumber: "1000",
        amount: 2000,
        EntityId: "euro-subsidiary",
      },
      {
        id: "j3",
        date: new Date("2024-01-23"),
        reference: "CASH-003",
        accountNumber: "1000",
        amount: 500,
        EntityId: "uk-subsidiary",
      },
    ];

    const rates: ExchangeRate[] = [
      {
        from: "EUR",
        to: "USD",
        rate: 1.1,
      },
      {
        from: "GBP",
        to: "USD",
        rate: 1.27,
      },
    ];

    const result = consolidateBalances(entities, journals, rates, "USD");

    expect(result).toEqual([
      { accountId: "1000", accountNumber: "1000", balance: 3835 },
    ]);
  });

  test("should handle multiple account numbers", () => {
    const entities: Entity[] = [
      {
        id: "parent-corp",
        currency: "USD",
        ParentId: "",
      },
      {
        id: "euro-subsidiary",
        currency: "EUR",
        ParentId: "parent-corp",
      },
    ];

    const journals: JournalEntry[] = [
      {
        id: "j1",
        date: new Date("2024-01-23"),
        reference: "CASH-001",
        accountNumber: "1000",
        amount: 1000,
        EntityId: "parent-corp",
      },
      {
        id: "j2",
        date: new Date("2024-01-23"),
        reference: "CASH-002",
        accountNumber: "1000",
        amount: 2000,
        EntityId: "euro-subsidiary",
      },
      {
        id: "j3",
        date: new Date("2024-01-23"),
        reference: "AR-001",
        accountNumber: "1100",
        amount: 1500,
        EntityId: "euro-subsidiary",
      },
      {
        id: "j4",
        date: new Date("2024-01-23"),
        reference: "AR-002",
        accountNumber: "1100",
        amount: 325,
        EntityId: "euro-subsidiary",
      },
    ];

    const rates: ExchangeRate[] = [
      {
        from: "EUR",
        to: "USD",
        rate: 1.1,
      },
    ];

    const result = consolidateBalances(entities, journals, rates, "USD");

    expect(result).toEqual([
      { accountId: "1000", accountNumber: "1000", balance: 3200 },
      { accountId: "1100", accountNumber: "1100", balance: 2007.5 },
    ]);
  });

  test("should handle grandparent tier with multiple accounts", () => {
    const entities: Entity[] = [
      {
        id: "parent-corp",
        currency: "USD",
        ParentId: "",
      },
      {
        id: "uk-subsidiary",
        currency: "GBP",
        ParentId: "parent-corp",
      },
      {
        id: "mexico-subsidiary",
        currency: "MXN",
        ParentId: "parent-corp",
      },
      {
        id: "euro-grandchild",
        currency: "EUR",
        ParentId: "uk-subsidiary",
      },
    ];

    const journals: JournalEntry[] = [
      // Cash account entries (1000)
      {
        id: "j1",
        date: new Date("2024-01-23"),
        reference: "CASH-001",
        accountNumber: "1000",
        amount: 1000,
        EntityId: "parent-corp",
      },
      {
        id: "j2",
        date: new Date("2024-01-23"),
        reference: "CASH-002",
        accountNumber: "1000",
        amount: 500,
        EntityId: "uk-subsidiary",
      },
      {
        id: "j3",
        date: new Date("2024-01-23"),
        reference: "CASH-003",
        accountNumber: "1000",
        amount: 2000,
        EntityId: "euro-grandchild",
      },
      {
        id: "j4",
        date: new Date("2024-01-23"),
        reference: "CASH-004",
        accountNumber: "1000",
        amount: 10000,
        EntityId: "mexico-subsidiary",
      },
      // Accounts Receivable entries (1100)
      {
        id: "j5",
        date: new Date("2024-01-23"),
        reference: "AR-001",
        accountNumber: "1100",
        amount: 300,
        EntityId: "uk-subsidiary",
      },
      {
        id: "j6",
        date: new Date("2024-01-23"),
        reference: "AR-002",
        accountNumber: "1100",
        amount: 1500,
        EntityId: "euro-grandchild",
      },
      {
        id: "j7",
        date: new Date("2024-01-23"),
        reference: "AR-003",
        accountNumber: "1100",
        amount: 5000,
        EntityId: "mexico-subsidiary",
      },
    ];

    const rates: ExchangeRate[] = [
      {
        from: "GBP",
        to: "USD",
        rate: 1.27,
      },
      {
        from: "EUR",
        to: "GBP",
        rate: 1.17,
      },
      {
        from: "MXN",
        to: "USD",
        rate: 0.06,
      },
    ];

    const result = consolidateBalances(entities, journals, rates, "USD");

    expect(result).toEqual([
      {
        accountId: "1000",
        accountNumber: "1000",
        balance: 5206.8,
      },
      {
        accountId: "1100",
        accountNumber: "1100",
        balance: 2909.85,
      },
    ]);
  });
});
