import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import { sql } from "../config/database";

export async function fooHandler(
  app: ReturnType<typeof Fastify>,
  barPort: number
) {
  app.get("/health", async () => ({ status: "ok" }));

  app.post("/foos", async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, bars } = request.body as {
      name: string;
      bars: Array<{ name: string; data: string }>;
    };

    request.log.info({ name, bars }, "Creating new foo with bars");

    try {
      // Start transaction
      return await sql.begin(async (tx) => {
        // Create Foo
        const [foo] = await tx`
          INSERT INTO foos (name)
          VALUES (${name})
          RETURNING id, name
        `;

        request.log.info({ fooId: foo.id }, "Created new foo");

        // Create Bars through Bar service
        const barPromises = bars.map(async (barData) => {
          request.log.info({ barData, fooId: foo.id }, "Creating bar for foo");
          const response = await fetch(`http://localhost:${barPort}/bars`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...barData,
              fooId: foo.id,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            return reply.status(response.status).send(errorText);
          }

          const result = await response.json();
          return result;
        });

        await Promise.all(barPromises);

        return foo;
      });
    } catch (error) {
      request.log.error({ error }, "Error creating Foo with Bars");
      return reply
        .status(500)
        .send({ error: "Failed to create Foo with Bars" });
    }
  });
}

const app = Fastify({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
    },
  },
});

await app.register(cors);
await fooHandler(app, 3001);

// Add test log
app.log.info("Server starting up...");

await app.listen({
  port: 3000,
  host: "0.0.0.0",
});

process.on("SIGINT", async () => {
  app.log.info("Shutting down Foo service...");
  await app.close();
  process.exit(0);
});
