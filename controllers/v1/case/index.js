'use strict'

module.exports = async (fastify, opts) => {
  const Case = fastify.sequelize.import('../../../db/models/history.js');

  fastify.post('/case', { schema: { body: fastify.schemas().createCase } }, async (request, reply) => {
    try {
      const { postalCode, geo, condition, timestamp, symptoms } = request.body
      await Case.create({ postalCode, geo, status: condition, timestamp, symptoms, user_id: 1, unix_ts: Date.now() })

      reply.send({ status: 'success' })
    } catch (error) {
      reply.status(500).send({
        error
      });
    }
  })

  fastify.get('/case/:id', { schema: { params: fastify.schemas().getCaseById } }, async (request, reply) => {
    try {
      const publicAttributes = { attributes: ['id', 'user_id', 'status', 'symptoms', 'timestamp'] };
      const clients = await Case.findOne({ where: { id: request.params.id }, ...publicAttributes });
      return clients;
    } catch (error) {
      reply.status(500).send({
        error
      });
    }
  })
}