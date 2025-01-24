import { app } from "./src/app";

// Handle not found routes
app.setNotFoundHandler((request, reply) => {
  reply.status(501).send({
    error: "Not Implemented",
    message: "This route does not exist",
  });
});

// Start the server
const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
