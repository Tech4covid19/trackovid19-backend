'use strict'

module.exports = async (fastify, opts) => {

  fastify.get('/symptom/all', {
    schema: {
      tags: ['symptom']
    }
  }, async (request, reply) => {
    try {
      const symptoms = await fastify.models().Symptom.findAll();
      return symptoms;
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }
  })
}