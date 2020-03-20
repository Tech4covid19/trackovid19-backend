'use strict'

const tools = require('../../../tools/tools')

module.exports = async (fastify, opts) => {

  fastify.get('/user', {
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['user'],
    }
  }, async (request, reply) => {
    try {
      const publicAttributes = { attributes: ['id', 'year', 'facebook_id', 'postalcode1', 'postalcode2', 'latitude', 'longitude', 'info', ['timestamp', 'createdAt'], ['unix_ts', 'lastLogin']] };
      var user = await fastify.models().Users.findOne({
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

      // Get last submitted case
      if (user.cases.length > 0) {
        const acase = user.cases.reduce((acc, item) => {
          if (acc.unix_ts < item.unix_ts) {
            return item;
          }
          else {
            return acc;
          }
        });
        
        // Check for symptoms
        const syms = await acase.getUser_symptoms();
        const has_symptoms = syms.reduce((acc, item) => {
          return acc || item.symptom_id !== 1;
        }, false);

        // Save current state in the user object
        user.has_symptoms = has_symptoms;
        user.has_symptoms_text = has_symptoms ? 'Com sintomas' : 'Sem sintomas';
        user.confinement_state = acase.confinement_state;
      }

      user.info = tools.parseInfo(user.info);
      user.facebook_id = user.facebook_id ? user.facebook_id.toString() : null
      reply.send(user);
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }
  })

  fastify.put('/user', {
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['user'],
      body: fastify.schemas().updateUser
    }
  }, async (request, reply) => {
    try {
      const { year, postalCode, geo, phone, email, name, patientToken, showOnboarding } = request.body;
      const user = await fastify.models().Users.findOne({
        where: { id: request.user.payload.id },
      });

      // Fill info
      const uinfo = tools.parseInfo(user.info);
      const info = tools.updateInfo(uinfo, name, email, phone)
      const strinfo = tools.stringifyInfo(info);

      // Decode postal code
      const postparts = tools.splitPostalCode(postalCode);

      console.log(postparts);

      await fastify.models().Users.update({ year, postalcode1: postparts[0], postalcode2: postparts[1], latitude: geo.lat, longitude: geo.lon, info: strinfo, unix_ts: Date.now(), patient_token: patientToken, show_onboarding: showOnboarding }, { where: { id: request.user.payload.id }, fields: ['year', 'postalcode1', 'postalcode2', 'latitude', 'longitude', 'unix_ts', 'info', 'patient_token', 'show_onboarding'] })
      reply.send({ status: 'ok' });
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }
  })
}
