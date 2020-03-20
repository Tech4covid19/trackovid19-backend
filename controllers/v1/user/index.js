'use strict'

module.exports = async (fastify, opts) => {

  fastify.get('/user', {
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['user'],
    }
  }, async (request, reply) => {
    try {
      const publicAttributes = { attributes: ['id', 'year', 'facebook_id', 'postalcode', 'latitude', 'longitude', 'info', ['timestamp', 'createdAt'], ['unix_ts', 'lastLogin']] };
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
      var info = JSON.parse(user.info != null ? user.info : '{}');
      info.version = 1
      info.name = name !== undefined ? name : info.name;
      info.phone = phone !== undefined ? phone : info.phone;
      info.email = email !== undefined ? email : info.email;

      await fastify.models().Users.update({ year, postalcode: postalCode, latitude: geo.lat, longitude: geo.lon, info: JSON.stringify(info), unix_ts: Date.now(), patient_token: patientToken, show_onboarding: showOnboarding }, { where: { id: request.user.payload.id }, fields: ['year', 'postalcode', 'latitude', 'longitude', 'unix_ts', 'info', 'patient_token', 'show_onboarding'] })
      reply.send({ status: 'ok' });
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }
  })
}
