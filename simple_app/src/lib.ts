import db from "./db";
import { Journal, JournalSchema } from "./schema";

export async function listJournals() {
  return await db<Journal[]>`
    SELECT 
      id,
      reference,
      account_number,
      date,
      amount,
      currency,
      created_at,
      updated_at
    FROM journals
    ORDER BY date DESC
  `;
}

export async function getJournal(id: string) {
  const [journal] = await db<Journal[]>`
    SELECT 
      id,
      reference,
      account_number,
      date,
      amount,
      currency,
      created_at,
      updated_at
    FROM journals 
    WHERE id = ${id}
  `;
  return journal;
}
export async function createJournal(data: unknown) {
  const journal = JournalSchema.parse(data);

  const [result] = await db<Journal[]>`
    INSERT INTO journals ${db(journal)}
    RETURNING 
      id,
      reference,
      account_number,
      date,
      amount,
      currency,
      created_at,
      updated_at
  `;
  return result;
}

export async function updateJournal(id: string, data: unknown) {
  const journal = JournalSchema.parse(data);

  const [result] = await db<Journal[]>`
    UPDATE journals 
    SET ${db(journal)}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING 
      id,
      reference,
      account_number,
      date,
      amount,
      currency,
      created_at,
      updated_at
  `;
  return result;
}

export async function deleteJournal(id: string) {
  const result = await db`
    DELETE FROM journals 
    WHERE id = ${id}
    RETURNING id
  `;
  return result.length > 0;
}
