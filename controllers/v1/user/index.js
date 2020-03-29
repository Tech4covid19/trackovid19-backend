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
      const publicAttributes = { attributes: ['id', 'external_id', 'year', 'postalcode1', 'postalcode2', 'latitude', 'longitude', 'info', 'optin_health_geo', 'created_at', 'updated_at'] };
      var user = await fastify.models().Users.findOne({
        where: { id: request.user.payload.id },
        include: [
          {
            model: fastify.models().Network
          },
          {
            model: fastify.models().Case,
            as: 'latest_status'
          },
          {
            model: fastify.models().Case,
            as: 'cases'
          }
        ],
        ...publicAttributes
      });

      // Now let's look for the user in the personal data model
      const personal = await fastify.models().UsersData.findOne({
          where: { id: request.user.payload.id_data }
      });

      if (!user || !personal) {
        reply.status(404).send({error: "Not found"});
      }
      else {

        // Temporary code to avoid disruptions while the database script is not run for
        // updating all users
        let acase = user.latest_status;
        if (!acase && user.cases.length > 0) {
          acase = user.cases.reduce((acc, item) => {
            if (acc.unix_ts < item.unix_ts) {
              return item;
            }
            else {
              return acc;
            }
          });
        }
        // End temporary code

        // Fill latest status info
        if (acase) {
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

        user.name = personal.name;
        user.email = personal.email;
        user.phone = personal.phone;
        user.show_onboarding = personal.show_onboarding;
        user.info = tools.buildInfo(personal.name, personal.email, personal.phone);
        user.health_hash = user.external_id;
        user.personal_hash = personal.external_id;

        user.optin_download_use = personal.optin_download_use;
        user.optin_privacy = personal.optin_privacy;
        user.optin_push = personal.optin_push;

        // Clear the result from unwanted info
        user.external_id = undefined;
        
        reply.send(user);
      }
      
    } catch (error) {
      request.log.error(error)
      reply.status(500).send(sanitize_log(error, 'Could not get user details'));
    }
  
  })

  fastify.put('/user', {
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['user'],
      body: fastify.schemas().updateUser
    }
  }, async (request, reply) => {

    // Create a transaction
    const t = await fastify.sequelize.transaction();

    try {
      const { year, postalCode, geo, phone, email, name, patientToken, showOnboarding, optin_download_use, optin_privacy, optin_health_geo, optin_push } = request.body;
      const user = await fastify.models().Users.findOne({
        where: { id: request.user.payload.id },
      });

      // Now let's look for the user in the personal data model
      const personal = await fastify.models().UsersData.findOne({
          where: { id: request.user.payload.id_data }
      });

      if (!user || !personal) {
        reply.status(404).send({error: "Not found"});
      }
      else {
        
        // Update user
        if (postalCode) {
          // Decode postal code
          const postparts = tools.splitPostalCode(postalCode);
          user.postalcode1 = postparts[0];
          user.postalcode2 = postparts[1]; 
        }
        if (geo) {
          user.latitude = geo.lat;
          user.longitude = geo.lon;
        }
        user.year = year;
        user.patient_token = patientToken;  
        
        // Process opt-ins
        user.optin_health_geo = optin_health_geo;
        if (optin_health_geo) {
          user.optin_health_geo_ts = new Date();
        }
        
        await user.save({transaction: t});

        // Update personal info
        personal.show_onboarding = showOnboarding;
        personal.name = name;
        personal.email = email;
        personal.phone = phone;

        // Process opt-ins
        personal.optin_download_use = optin_download_use;
        if (optin_download_use) {
          personal.optin_download_use_ts = new Date();
        }
        personal.optin_privacy = optin_privacy;
        if (optin_privacy) {
          personal.optin_privacy_ts = new Date();
        }
        personal.optin_push = optin_push;
        if (optin_push) {
          personal.optin_push_ts = new Date();
        }

        await personal.save({transaction: t});

        // Commit the transaction
        await t.commit();

        reply.send({ status: 'ok' });
      }
    } catch (error) {
      request.log.error(error)
      // Rollback the transaction
      await t.rollback();
      reply.status(500).send(sanitize_log(error, 'Could not update user details'));
    }
  })
}
