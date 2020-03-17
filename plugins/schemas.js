'use strict'

const fp = require('fastify-plugin')

const schemas = {
    createCase: {
        type: 'object',
        required: ['postalCode', 'condition', 'confinementState'],
        properties: {
            confinementState: {
                type: 'number'
            },
            postalCode: {
                type: 'string',
                pattern: "^[0-9]{4}-[0-9]{3}$"
            },
            geo: {
                type: 'object',
                properties: {
                    lat: {
                        type: 'number'
                    },
                    lon: {
                        type: 'number'
                    }
                }
            },
            condition: {
                type: 'number'
            }
        }
    },
    updateUser: {
        type: 'object',
        properties: {
            year: {
                type: 'number'
            },
            postalCode: {
                type: 'string',
                pattern: "^[0-9]{4}-[0-9]{3}$"
            },
            geo: {
                type: 'object',
                properties: {
                    lat: {
                        type: 'number'
                    },
                    lon: {
                        type: 'number'
                    }
                }
            },
            info: {
                type: 'object'
            }
        }
    }
};

module.exports = fp(async (fastify, opts) => {
    fastify.decorate('schemas', () => {
        return schemas
    })
})