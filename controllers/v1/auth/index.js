'use strict'
module.exports = async (fastify, opts) => {

    fastify.get('/login/facebook/callback', async function (request, reply) {
        try {
            const token = await this.facebookOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
            const { data: { id, name }, status } = await fastify.axios.get('https://graph.facebook.com/v3.0/me?fields=id,name', { headers: { Authorization: `Bearer ${token.access_token}` } })
            await fastify.models().Users.upsert({ id, ip: request.ip, facebook_id: id, timestamp: new Date(), unix_ts: Date.now(), info: JSON.stringify({ name }) }, { fields: ['unix_ts', 'info'] })

            reply.send({ access_token: await fastify.jwt.sign({ payload: { id, name }, roles: ['user'] }) });
        } catch (error) {
            request.log.error(error)
            reply.status(500).send({ error: 'Could not authenticate correctly' })
        }
    })
}