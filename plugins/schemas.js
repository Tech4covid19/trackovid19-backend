'use strict'

const fp = require('fastify-plugin')

const schemas = {
    createCase: {
        type: 'object',
        required: ['postalCode', 'condition', 'confinementState', 'symptoms'],
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
            },
            symptoms: {
                type: 'array',
                items: {
                    type: 'number'
                }
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
            email: {
                type: 'string'
            },
            phone: {
                type: 'string'
            },
            name: {
                type: 'string'
            },
            patientToken: {
                type: 'string'
            },
            showOnboarding: {
                type: 'boolean'
            },
            optin_download_use: {
                type: 'boolean'
            },
            optin_privacy: {
                type: 'boolean'
            },
            optin_health_geo: {
                type: 'boolean'
            },
            optin_push: {
                type: 'boolean'
            }
        }
    },
    getGeoCases: {
        postalCode: {
            type: 'string',
            pattern: "^[0-9]{4}-[0-9]{3}$"
        }
    }
};

module.exports = fp(async (fastify, opts) => {
    fastify.decorate('schemas', () => {
        return schemas
    })
})
