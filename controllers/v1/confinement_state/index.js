'use strict'

module.exports = async (fastify, opts) => {

  fastify.get('/confinementState/all', {
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['confinement']
    }
  }, async (request, reply) => {
    try {
      const states = await fastify.models().ConfinementState.findAll();
      return states;
    } catch (error) {
      request.log.error(error)
      reply.status(500).send(sanitize_log(error, 'Could not get confinement states'));
    }
  })
}