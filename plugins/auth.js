const fp = require('fastify-plugin')
const { readFileSync } = require('fs')
const path = require('path')

module.exports = fp(async (fastify, opts) => {
    fastify.register(require('fastify-jwt'), {
        secret: process.env.JWT_SECRET,
        decode: { complete: true },
        sign: { algorithm: 'HS256', expiresIn: '24h' }
    })

    fastify.decorate('authenticate', async (request, reply) => {
        try {
            await request.jwtVerify()
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
