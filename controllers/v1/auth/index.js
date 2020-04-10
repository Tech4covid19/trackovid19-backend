'use strict'

const tools = require('../../../tools/tools');
const identityProviders = require('../../../services/identity-providers');

module.exports = async (fastify, opts) => {

  // called by mobile app

  fastify.post('/login/:provider/token', {
    // schema: {
    //   tags: ['auth']
    // }
  }, async function (request, reply) {
    if (!request.body || !request.body.access_token) {
      reply.status(400).send({
        error: 'Missing token'
      });
    } else {
      const provider = identityProviders.providerByName(request.params.provider);
      if (!provider) {
        reply.status(400).send({
          error: 'Unkown provider'
        });
      }
      const token = request.body;

      try {
        const jwt = await identityProviders.getJwtWithProviderToken.call(this, provider, token);
  
        if (!jwt) {
          let msg = `There was an error authenticating the user`; // : ${JSON.stringify(err || {})}`;
          console.log(msg);
          request.log.error(msg);
          reply.redirect(`${process.env.HOME_URL}`);
        }
        else {
          reply.send({ token: jwt, state: request.query.state });
        }
      } catch (error) {
        console.log('Could not authenticate correctly', error);
        request.log.error(error);
        reply.status(500).send(sanitize_log(error, 'Could not authenticate correctly'));
      }
    }
  });

  // called by indentity provider

  fastify.get('/login/:provider/callback', {
    schema: {
      tags: ['auth']
    }
  }, async function (request, reply) {
    if (!request.params.provider || !identityProviders.providers[request.params.provider]) {
      reply.status(400).send({
        error: 'Missing provider name'
      });
    } else {
      const provider = identityProviders.providerByName(request.params.provider);

      try {
        const jwt = await identityProviders.getJwtWithProviderCodeFlow.call(this, provider, request);
  
        if (!jwt) {
          let msg = `There was an error authenticating the user`; // : ${JSON.stringify(err || {})}`;
          console.log(msg);
          request.log.error(msg);
          reply.redirect(`${process.env.HOME_URL}`);
        }
        else {
          reply.redirect(`${process.env.AFTER_LOGIN_CALLBACK_URL}/#/post-code?code=${jwt}&state=${request.query.state}&provider=${provider.id}`);
        }
      } catch (error) {
        console.log('Could not authenticate correctly', error);
        request.log.error(error);
        reply.status(500).send(sanitize_log(error, 'Could not authenticate correctly'));
      }
    }
  });

}
