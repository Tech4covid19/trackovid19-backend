'use strict'

module.exports = async (fastify, opts) => {

  fastify.post('/case', { preValidation: [fastify.authenticate], schema: { body: fastify.schemas().createCase } }, async (request, reply) => {
    try {
      const { postalCode, geo, condition, confinementState } = request.body
      
      await fastify.models().Case.create({ postalCode, latitude: geo.lat, longitude: geo.lon, status: condition, confinement_state: confinementState, user_id: request.user.payload.id, timestamp: Date(), unix_ts: Date.now()})

      reply.send({ status: 'success' })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }
  })

  fastify.get('/case/all', async (request, reply) => {
    try {
      const cases = await fastify.models().Case.findAll();
      return cases;
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }
  })
}