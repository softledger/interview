import { expect } from "bun:test";
import { sql } from "../config/database";

await sql`DELETE FROM bars`;
await sql`DELETE FROM foos`;

const response = await fetch(`http://localhost:3000/foos`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Test Foo",
    bars: [{ name: "Bar 1", data: "Data 1" }],
  }),
});

console.log(response);
expect(response.status).toBe(200);

const foos = await sql`SELECT * FROM foos`;
const bars = await sql`SELECT * FROM bars`;

expect(foos.length).toBe(1);
expect(bars.length).toBe(1);
await sql.end();
