import fp from "fastify-plugin";

export const authMiddleware = fp(async function (fastify, options) {
  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply
        .code(401)
        .send({ error: "Unauthorized", message: "Authentication required" });
    }
  });

  // Verify admin role
  fastify.decorate("isAdmin", async function (request, reply) {
    if (request.user && request.user.role === "admin") {
      return;
    }
    reply
      .code(403)
      .send({ error: "Forbidden", message: "Admin access required" });
  });
});
