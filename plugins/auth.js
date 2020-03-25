const fp = require('fastify-plugin')
const { readFileSync } = require('fs')
const path = require('path')
const tools = require('./../tools/tools')

module.exports = fp(async (fastify, opts) => {
    fastify.register(require('fastify-jwt'), {
        secret: process.env.JWT_SECRET,
        decode: { complete: true },
        sign: { algorithm: 'HS256', expiresIn: '24h' }
    })

    fastify.decorate('authenticate', async (request, reply) => {
        try {
            await request.jwtVerify()
            if (request.user && request.user.payload) {
                console.log(request.user);
                if (!request.user.payload.id) {
                    // Make sure we don't blow up in the face of users that had signed in with the previous method
                    request.user.payload = tools.decrypt_payload(request.user.payload);
                }
            }
            
        } catch (err) {
            reply.send(err)
        }
    })

    /*
    fastify.decorate('isAdmin', async (request, reply) => {
            if (request.user.roles.includes('admin')) {
                return true
            } else {
                reply.status(403).send({ err: 'No permission' })
            }
        })
    */
})
