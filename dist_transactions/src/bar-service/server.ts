import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import { sql } from "../config/database";

export async function barHandler(app: ReturnType<typeof Fastify>) {
  app.get("/health", async () => ({ status: "ok" }));

  app.post("/bars", async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, data, fooId } = request.body as {
      name: string;
      data: string;
      fooId: string;
    };

    try {
      const [bar] = await sql`
        INSERT INTO bars (name, data, foo_id)
        VALUES (${name}, ${data}, ${fooId})
        RETURNING id, name, data, foo_id
      `;

      return bar;
    } catch (error) {
      console.log(error);
      app.log.error("Error creating Bar:", error);
      return reply.status(500).send("Failed to create Foo with Bars");
    }
  });
}

const app = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

await app.register(cors);
await barHandler(app);

await app.listen({
  port: 3001,
  host: "0.0.0.0",
});

process.on("SIGINT", async () => {
  console.log("Shutting down Bar service...");
  await app.close();
  process.exit(0);
});
