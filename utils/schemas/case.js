const Joi = require('@hapi/joi');

const geoSchema = require('./geo');
const CONDITIONS = require('../../enums/conditions');

module.exports = Joi.object({
    fbId: Joi
        .string()
        .required(),
    postalCode: Joi
        .string()
        .pattern(/^[0-9]{4}-[0-9]{3}$/, 'postal code')
        .required(),
    geo: geoSchema.required(),
    condition: Joi
        .string()
        .valid(...Object.values(CONDITIONS))
        .required(),
    timestamp: Joi
        .date()
        .iso()
        .default(new Date().toISOString())
});
