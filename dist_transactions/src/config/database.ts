import postgres from "postgres";

export const sql = postgres(
  "postgres://postgres:password@localhost:5432/postgres"
);

// Initialize database schema
export async function initializeDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS foos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS bars (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      data TEXT NOT NULL,
      foo_id UUID NOT NULL,
      FOREIGN KEY (foo_id) REFERENCES foos(id)
    )
  `;
}
