'use strict'

module.exports = async (fastify, opts) => {

  fastify.post('/case', {
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['case'],
      body: fastify.schemas().createCase
    }
  }, async (request, reply) => {

    // Create a transaction
    const t = await fastify.sequelize.transaction();

    // Do the magic...
    try {

      const { postalCode, geo, condition, confinementState, symptoms } = request.body;
      const symptoms_list = symptoms.map(id => ({symptom_id: id, timestamp: Date(), unix_ts: Date.now()}));

      await fastify.models().Case.create(
        {postalcode: postalCode, latitude: geo.lat, longitude: geo.lon, status: condition, confinement_state: confinementState, user_id: request.user.payload.id, timestamp: Date(), unix_ts: Date.now(), user_symptoms: symptoms_list },
        {
          transaction: t,
          include: [
            {
              model: fastify.models().UserSymptom
            }
          ]
        }
      )

      // Commit the transaction
      await t.commit();

      reply.send({ status: 'success' })
    } catch (error) {
      request.log.error(error)

      // Rollback the transaction
      await t.rollback();

      reply.status(500).send({
        error
      });
    }
  })

  fastify.get('/case/all', {
    schema: {
      tags: ['case']
    }
  }, async (request, reply) => {
    try {
      const cases = await fastify.models().Case.findAll({
        include: [
          {
            model: fastify.models().UserSymptom
          }
        ]
      });
      return cases;
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }
  })

  fastify.get('/case/condition/:postalCode', {
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['case'],
      params: fastify.schemas().getGeoCases
    }
  }, async (request, reply) => {
    try {
      const cases = await fastify.models().StatusByPostalCode.findAll({
        where: { postalcode: request.params.postalCode }
      });

      return cases;
    } catch (error) {
      console.log('------------------------------------');
      console.log(error);
      console.log('------------------------------------');
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }
  });

  fastify.get('/case/confinement/:postalCode', {
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['case'],
      params: fastify.schemas().getGeoCases
    }
  }, async (request, reply) => {
    try {
      const cases = await fastify.models().ConfinementStateByPostalCode.findAll({
        where: { postalcode: request.params.postalCode }
      });

      return cases;
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }
  });
}