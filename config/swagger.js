exports.options = {
    routePrefix: '/documentation',
    exposeRoute: true,
    swagger: {
        info: {
            title: 'Trackovid19 API',
            description: 'Trackovid19-Backend API',
            version: '0.0.1'
        },
        externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here'
        },
        servers: [{
            url: 'http://localhost:3000',
            description: 'Local Server',
        }],
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        tags: [
            { name: 'auth', description: 'Auth related end-points' },
            { name: 'user', description: 'User related end-points' },
            { name: 'case', description: 'Cases related end-points' },
            { name: 'symptom', description: 'Symptoms related end-points' },
            { name: 'condition', description: 'Condition related end-points' }
        ],
    },
    routePrefix: '/doc'
};