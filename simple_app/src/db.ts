import Sql from "postgres";

// @ts-ignore looks like a bug with bun
const db = new Sql("postgres://postgres:password@localhost:5432/postgres");

export default db;
