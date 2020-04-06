'use strict'

const { v4: uuidv4 } = require('uuid');
const tools = require('../../../tools/tools');

var state = 0;

module.exports = async (fastify, opts) => {

  fastify.get('/login/facebook/callback', {
    schema: {
      tags: ['auth']
    }
  }, function (request, reply) {
    completeIdentityProviderLogin.call(this, {
      id: tools.identityProviders.facebook,
      name: tools.identityProviders.nameById(tools.identityProviders.facebook),
      userInfoUrl: process.env.FB_USER_INFO_URL // 'https://graph.facebook.com/v3.0/me?fields=id,name,email'
    }, request, reply);  
  })

  fastify.get('/login/google/callback', {
    schema: {
      tags: ['auth']
    }
  }, function (request, reply) {
    completeIdentityProviderLogin.call(this, {
      id: tools.identityProviders.google,
      name: tools.identityProviders.nameById(tools.identityProviders.google),
      userInfoUrl: process.env.GOOGLE_USER_INFO_URL // 'https://www.googleapis.com/oauth2/v1/userinfo' // 'https://www.googleapis.com/plus/v1/people/me'
    }, request, reply);
  })

  function completeIdentityProviderLogin (provider, request, reply) {
    try {
      this[`${provider.name}OAuth2`].getAccessTokenFromAuthorizationCodeFlow(request, async (err, token) => {
  
        if (err) {
          console.log("ERROR: ", err);
          reply.redirect(`${process.env.HOME_URL}`);
        }
  
        if (!token) {
          let msg = `There was an error authenticating the user: ${JSON.stringify(err || {})}`;
          console.log(msg);
          request.log.error(msg);
          reply.redirect(`${process.env.HOME_URL}`);
        }
        else {
          const { data: { id, name, email }, status } = await fastify.axios.get(provider.userInfoUrl, { headers: { Authorization: `Bearer ${token.access_token}` } })
          
          // Let's generate the hashes
          const hashes = tools.generateIdentityProviderHashes(provider.name, id);
  
          // Let's look for a user in the health data model
          let user = await fastify.models().Users.findOne({
            where: { external_id: hashes.health }
          });
  
          if (!user) {
            user = await fastify.models().Users.create({
              external_id: hashes.health,
              external_id_provider_id: provider.id,
              last_login: new Date()
            }, { fields: ['external_id', 'external_id_provider_id', 'last_login'] }
            );
          }
          else {
            // Update the user info
            user.last_login = new Date();
            await user.save();
          }
  
          // Now let's look for the user in the personal data model
          let personal = await fastify.models().UsersData.findOne({
              where: { external_id: hashes.personal }
          });
  
          if (!personal) {
            const personal_id = uuidv4();
            personal = await fastify.models().UsersData.create({
              id: personal_id,
              external_id: hashes.personal,
              external_id_provider_id: provider.id,
              name: name,
              email: email
            }, { fields: ['id', 'external_id', 'external_id_provider_id', 'name', 'email'] }
            );
          }
          else {
            // Update the personal info
            personal.name = name;
            personal.email = email;
            await personal.save();
          }
  
          // Generate the JWT token
          let iv = tools.generate_iv();
          let payload = tools.encrypt_payload({
            id: user.id,
            id_data: personal.id,
            name: name
          }, iv);
          const jwt = await fastify.jwt.sign({
            payload: payload,
            session: iv,
            roles: ['user']
          });
          // send redirect
          reply.redirect(`${process.env.AFTER_LOGIN_CALLBACK_URL}/#/post-code?code=${jwt}&state=${request.query.state}&provider=${provider.id}`);
        }
      })
    } catch (error) {
      request.log.error(error);
      reply.status(500).send(sanitize_log(error, 'Could not authenticate correctly'));
    }
  
  }

}
