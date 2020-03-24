'use strict'

const uuidv4 = require('uuid/v4');
const tools = require('../../../tools/tools');

module.exports = async (fastify, opts) => {

    fastify.get('/login/facebook/callback', {
        schema: {
            tags: ['auth']
        }
    }, function (request, reply) {
        try {
            this.facebookOAuth2.getAccessTokenFromAuthorizationCodeFlow(request, async (err, token) => {
                const { data: { id, name, email }, status } = await fastify.axios.get('https://graph.facebook.com/v3.0/me?fields=id,name,email', { headers: { Authorization: `Bearer ${token.access_token}` } })

                // Let's generate the hashes
                const hashes = tools.generateFacebookHashes(id);

                // Let's look for a user in the health data model
                let user = await fastify.models().Users.findOne({
                    where: { external_id: hashes.health }
                });

                if (!user) {
                    user = await fastify.models().Users.create({
                        external_id: hashes.health,
                        external_id_provider_id: 1,
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
                        external_id_provider_id: 1,
                        name: name,
                        email: email,
                        last_login: new Date()
                    }, { fields: ['id', 'external_id', 'external_id_provider_id', 'name', 'email', 'last_login'] }
                    );
                }
                else {
                    // Update the personal info
                    personal.name = name;
                    personal.email = email;
                    personal.last_login = new Date();
                    await personal.save();
                }

                // Generate the JWT token
                const jwt = await fastify.jwt.sign({
                    payload: {
                        id: user.id,
                        id_data: personal.id,
                        name: name
                    },
                    roles: ['user']
                });
                // send redirect
                reply.redirect(`${process.env.AFTER_LOGIN_CALLBACK_URL}/#/post-code?code=${jwt}&state=${request.query.state}`);
            })
        } catch (error) {
            request.log.error(error)
            reply.status(500).send({ error: 'Could not authenticate correctly' })
        }

    })
}
