'use strict'

const tools = require('../../../tools/tools')

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

        const {postalCode, geo, condition, confinementState, symptoms} = request.body
        const symptoms_list = symptoms.map(
            id => ({symptom_id: id, timestamp: Date(), unix_ts: Date.now()}))

        // Decode postal code
        const postparts = tools.splitPostalCode(postalCode)

        const postalCodeDB = await fastify.models().PostalCodes.findOne({
            where: {
                postal_number: postparts[0],
                postal_extension: postparts[1],
            },
        })

        if (!postalCodeDB) {
            // Commit the transaction
            await t.commit()

            reply.status(400).send({error: 'Invalid postal code'})
            return
        }

        // Now let's look for the user in the personal data model
        const user = await fastify.models().Users.findOne({
            where: {id: request.user.payload.id},
        })

        const personal = await fastify.models().UsersData.findOne({
            where: {id: request.user.payload.id_data},
        })

      if (!user || !personal) {

        // Commit the transaction
        await t.commit();

        reply.status(404).send({error: "Not found"});
      }
      else {

        const acase = await fastify.models().Case.create(
          {postalcode1: postparts[0], postalcode2: postparts[1], latitude: geo.lat, longitude: geo.lon, status: condition, confinement_state: confinementState, user_id: request.user.payload.id, timestamp: Date(), unix_ts: Date.now(), user_symptoms: symptoms_list },
          {
            transaction: t,
            include: [
              {
                model: fastify.models().UserSymptom
              }
            ]
          }
        );

        // save the date in the personal model (only the date, to prevent correlation)
        personal.symptoms_updated_at = new Date((new Date).toDateString());

        // Set this update as the latest one for the user
        user.latest_status_id = acase.id;

        await user.save({transaction: t});
        await personal.save({transaction: t});

        // Commit the transaction
        await t.commit();

        reply.send({ status: 'success' })
      }

    } catch (error) {
      request.log.error(error)

      // Rollback the transaction
      await t.rollback();

      reply.status(500).send(sanitize_log(error, 'Could not update user state'));
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
        where: { user_id: request.user.payload.id },
        include: [
          {
            model: fastify.models().UserSymptom
          }
        ]
      });
      return cases;
    } catch (error) {
      request.log.error(error)
      reply.status(500).send(sanitize_log(error, 'Could not get user states'));
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

      // Decode postal code
      const postparts = tools.splitPostalCode(request.params.postalCode);

      var cases = await fastify.models().StatusByPostalCode.findAll({
        where: { postalcode1: postparts[0] },
        order: [['summary_order']]
      });

      // Fallback when the postal code does not have any registered case yet
      if (cases.length == 0) {
        const conditions = await fastify.models().Condition.findAll({
          where: {show_in_summary: true},
          order: [['summary_order']]
        });
        cases = [
          {
            postalcode: postparts[0],
            status: 100,
            status_text: 'Com sintomas',
            hits: 0
          },
          {
            postalcode: postparts[0],
            status: 200,
            status_text: 'Sem sintomas',
            hits: 0
          }
        ].concat(conditions.map(cond => ({
          postalcode: postparts[0],
          status: cond.id,
          status_text: cond.status_summary,
          hits: 0
        })));
      }

      return cases;
    } catch (error) {
      request.log.error(error)
      reply.status(500).send(sanitize_log(error, 'Could not get conditions by postal code'));
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

      // Decode postal code
      const postparts = tools.splitPostalCode(request.params.postalCode);

      var cases = await fastify.models().ConfinementStateByPostalCode.findAll({
        where: { postalcode1: postparts[0] },
        order: [['summary_order']]
      });

      // Fallback when the postal code does not have any registered case yet
      if (cases.length == 0) {
        const states = await fastify.models().ConfinementState.findAll({
          where: {show_in_summary: true},
          order: [['summary_order']]
        });
        cases = states.map(state => ({
          postalcode: postparts[0],
          confinement_state: (state.id == 2 ? 300 : state.id),
          confinement_state_text: state.state_summary,
          hits: 0
        })).filter(state => state.confinement_state != 3);
      }

      return cases;
    } catch (error) {
      request.log.error(error)
      reply.status(500).send(sanitize_log(error, 'Could not get confinement states by postal code'));
    }
  });
}
