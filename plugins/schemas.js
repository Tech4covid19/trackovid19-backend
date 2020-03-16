'use strict'

const fp = require('fastify-plugin')

const schemas = {
    createCase: {
        type: 'object',
        required: ['postalCode', 'condition', 'timestamp', 'symptoms'],
        properties: {
            symptoms: {
                type: 'boolean'
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
                type: 'string',
                enum: ["normal", "infected", "quarantine", "symptomatic", "recovered"]
            },
            timestamp: {
                type: 'string',
                format: 'date-time'
            }
        }
    },
    getCaseById: {
        type: 'object',
        required: ['id'],
        properties: {
            symptoms: {
                type: 'boolean'
            }
        }
    }
};

module.exports = fp(async (fastify, opts) => {
    fastify.decorate('schemas', () => {
        return schemas
    })
})