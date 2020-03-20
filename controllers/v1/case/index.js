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
    preValidation: [fastify.authenticate],
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
      var cases = await fastify.models().StatusByPostalCode.findAll({
        where: { postalcode: request.params.postalCode }
      });

      // Fallback when the postal code does not have any registered case yet
      if (cases.length == 0) {
        const conditions = await fastify.models().Condition.findAll();
        cases = conditions.map(cond => ({
          postalcode: request.params.postalCode,
          status: cond.id,
          status_text: cond.status_summary,
          hits: 0
        })).concat([
          {
            postalcode: request.params.postalCode,
            status: 100,
            status_text: 'Com sintomas',
            hits: 0
          },
          {
            postalcode: request.params.postalCode,
            status: 200,
            status_text: 'Sem sintomas',
            hits: 0
          }
        ]);
      }

      return cases;
    } catch (error) {
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
      var cases = await fastify.models().ConfinementStateByPostalCode.findAll({
        where: { postalcode: request.params.postalCode }
      });

      // Fallback when the postal code does not have any registered case yet
      if (cases.length == 0) {
        const states = await fastify.models().ConfinementState.findAll();
        cases = states.map(state => ({
          postalcode: request.params.postalCode,
          confinement_state: (state.id == 2 ? 300 : state.id),
          confinement_state_text: state.state_summary,
          hits: 0
        })).filter(state => state.confinement_state != 3);
      }

      return cases;
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }
  });
}