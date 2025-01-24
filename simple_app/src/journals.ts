import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import * as journals from "./lib";

export async function journalRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    try {
      return await journals.listJournals();
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const journal = await journals.getJournal(id);

      if (!journal) {
        reply.status(404).send({ error: "Journal not found" });
        return;
      }

      return journal;
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: "Internal server error" });
    }
  });

  fastify.post("/", async (request, reply) => {
    try {
      const result = await journals.createJournal(request.body);
      reply.status(201).send(result);
    } catch (error) {
      if (error instanceof ZodError) {
        reply
          .status(400)
          .send({ error: "Validation error", details: error.errors });
        return;
      }
      request.log.error(error);
      reply.status(500).send({ error: "Internal server error" });
    }
  });

  fastify.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const result = await journals.updateJournal(id, request.body);

      if (!result) {
        reply.status(404).send({ error: "Journal not found" });
        return;
      }

      return result;
    } catch (error) {
      if (error instanceof ZodError) {
        reply
          .status(400)
          .send({ error: "Validation error", details: error.errors });
        return;
      }
      request.log.error(error);
      reply.status(500).send({ error: "Internal server error" });
    }
  });

  fastify.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const deleted = await journals.deleteJournal(id);

      if (!deleted) {
        reply.status(404).send({ error: "Journal not found" });
        return;
      }

      reply.status(204).send();
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: "Internal server error" });
    }
  });
}
