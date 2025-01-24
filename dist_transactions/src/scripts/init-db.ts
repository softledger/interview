import { sql, initializeDatabase } from "../config/database";

console.log("Initializing database...");

try {
  console.log("Dropping existing tables...");
  await sql`DROP TABLE IF EXISTS bars`;
  await sql`DROP TABLE IF EXISTS foos`;

  await initializeDatabase();
  console.log("Database initialized successfully!");
} catch (error) {
  console.error("Failed to initialize database:", error);
  process.exit(1);
} finally {
  await sql.end();
}
