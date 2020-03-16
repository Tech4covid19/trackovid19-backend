const fp = require('fastify-plugin')
const { readFileSync } = require('fs')
const path = require('path')

module.exports = fp(async (fastify, opts) => {
    fastify.register(require('fastify-jwt'), {
        secret: {
            private: readFileSync(`${path.join(__dirname, 'certs')}/private.key`, 'utf8'),
            public: readFileSync(`${path.join(__dirname, 'certs')}/public.key`, 'utf8')
        },
        decode: { complete: true },
        sign: { algorithm: 'RS256', expiresIn: '2h' }
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