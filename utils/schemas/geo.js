const Joi = require('@hapi/joi');

module.exports = Joi.object({
    lat: Joi
        .number()
        .required(),
    lon: Joi
        .number()
        .required()
});
