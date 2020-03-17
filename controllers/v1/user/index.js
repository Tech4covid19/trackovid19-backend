'use strict'

module.exports = async (fastify, opts) => {

  fastify.get('/user', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    try {
      const publicAttributes = { attributes: ['id', 'year', 'facebook_id', 'postalcode', 'latitude', 'longitude', 'info', ['timestamp', 'createdAt'], ['unix_ts', 'lastLogin']] };
      const user = await fastify.models().Users.findOne({
        where: { id: request.user.payload.id },
        include: [
          {
            model: fastify.models().Case
          },
          {
            model: fastify.models().Network
          }
        ],
        ...publicAttributes
      });
      user.info = JSON.parse(user.info);
      user.facebook_id = user.facebook_id ? user.facebook_id.toString() : null
      reply.send(user);
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }
  })

  fastify.put('/user', { preValidation: [fastify.authenticate], schema: { body: fastify.schemas().updateUser } }, async (request, reply) => {
    try {
      const { year, postalCode, geo, info } = request.body;
      await fastify.models().Users.update({ year, postalcode: postalCode, latitude: geo.lat, longitude: geo.lon, info: JSON.stringify(info), unix_ts: Date.now() }, { where: { id: request.user.payload.id }, fields: ['year', 'postalcode', 'latitude', 'longitude', 'unix_ts', 'info'] })
      reply.send({ status: 'ok' });
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }
  })
}