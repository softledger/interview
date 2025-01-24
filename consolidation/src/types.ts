export interface Entity {
  id: string;
  currency: string;
  ParentId: string; // reference to the parent entity
}

export interface JournalEntry {
  id: string;
  date: Date;
  reference: string;
  accountNumber: string;
  amount: number;
  EntityId: string;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
}

export interface ConsolidatedBalance {
  accountId: string;
  accountNumber: string;
  balance: number;
}
