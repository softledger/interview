import db from "./src/db";

// Drop existing tables
await db`DROP TABLE IF EXISTS "journals"`;

await db`
CREATE TABLE "journals" (
  id SERIAL,
  reference character varying(255),
  "account_number" character varying(255),
  "date" date,
  amount numeric,
  currency character varying(10),
  "created_at" timestamp with time zone DEFAULT NOW() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT NOW() NOT NULL,
  PRIMARY KEY (id)
);
`;

console.log("Database cleaned and schema reloaded!");

await db.end();
