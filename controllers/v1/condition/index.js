'use strict'

module.exports = async (fastify, opts) => {

  fastify.get('/condition/all', {
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['condition']
    }
  }, async (request, reply) => {
    try {
      const conditions = await fastify.models().Condition.findAll();
      return conditions;
    } catch (error) {
      request.log.error(error)
      reply.status(500).send(sanitize_log(error, 'Could not get conditions'));
    }
  })
}