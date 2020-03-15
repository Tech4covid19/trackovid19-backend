const Joi = require('@hapi/joi');

const logger = require('../utils/logger')('schema-validator');

class SchemaValidator {
    constructor (schema) {
        const isSchema = Joi.isSchema(schema);

        if (!isSchema) {
            throw new Error('Expecting schema to be a valid Joi schema');
        }

        this.schema = schema;
    }

    async validate(data) {
        try {
            return await this.schema.validateAsync(data);
        } catch (err) {
            logger.error(`Schema validation failed: ${err.message}`);
            throw err;
        }
    }
}

module.exports = SchemaValidator;
