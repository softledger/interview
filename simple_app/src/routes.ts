import { FastifyInstance } from "fastify";
import { journalRoutes } from "./journals";

export async function registerRoutes(fastify: FastifyInstance) {
  fastify.register(journalRoutes, { prefix: "/journals" });
}
