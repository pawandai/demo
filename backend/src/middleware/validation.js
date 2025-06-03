export const validateRequest = (schema) => {
  return async (request, reply) => {
    try {
      const { body, params, query } = request;

      if (schema.body && body) {
        const { error } = schema.body.validate(body, { abortEarly: false });
        if (error) {
          return reply.code(400).send({
            error: "Validation error",
            details: error.details.map((detail) => detail.message),
          });
        }
      }

      if (schema.params && params) {
        const { error } = schema.params.validate(params, { abortEarly: false });
        if (error) {
          return reply.code(400).send({
            error: "Validation error",
            details: error.details.map((detail) => detail.message),
          });
        }
      }

      if (schema.query && query) {
        const { error } = schema.query.validate(query, { abortEarly: false });
        if (error) {
          return reply.code(400).send({
            error: "Validation error",
            details: error.details.map((detail) => detail.message),
          });
        }
      }
    } catch (error) {
      request.log.error(error);
      return reply
        .code(500)
        .send({ error: "Internal server error during validation" });
    }
  };
};
