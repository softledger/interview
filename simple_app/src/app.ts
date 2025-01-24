import Fastify from "fastify";
import { registerRoutes } from "./routes";

export const app = Fastify({
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

registerRoutes(app);
