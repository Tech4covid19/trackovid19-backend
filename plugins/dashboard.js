'use strict'

const fp = require('fastify-plugin')
const tools = require('../tools/tools');

module.exports = fp(async (fastify, opts) => {

  fastify.decorate('fetchConditionsByPostalCode', async (postalCode) => {
    
    // Validate
    if (!postalCode) {
        throw new Error('Invalid postal code');
    }

    // Decode postal code
    const postparts = tools.splitPostalCode(postalCode);

    var cases = await fastify.models().StatusByPostalCode.findAll({
        where: { postalcode1: postparts[0] },
        order: [["summary_order"]],
    });

    // Fallback when the postal code does not have any registered case yet
    if (cases.length == 0) {
        const conditions = await fastify.models().Condition.findAll({
            where: { show_in_summary: true },
            order: [["summary_order"]],
        });
        cases = [
            {
                postalcode: postparts[0],
                status: 100,
                status_text: "Com sintomas",
                hits: 0,
            },
            {
                postalcode: postparts[0],
                status: 200,
                status_text: "Sem sintomas",
                hits: 0,
            },
        ].concat(
            conditions.map((cond) => ({
                postalcode: postparts[0],
                status: cond.id,
                status_text: cond.status_summary,
                hits: 0,
            }))
        );
    }

    return cases;
  })

  fastify.decorate('fetchConfinementStatesByPostalCode', async (postalCode) => {
    
    // Validate
    if (!postalCode) {
        throw new Error('Invalid postal code');
    }

    // Decode postal code
    const postparts = tools.splitPostalCode(postalCode);

    var cases = await fastify.models().ConfinementStateByPostalCode.findAll({
        where: { postalcode1: postparts[0] },
        order: [["summary_order"]],
    });

    // Fallback when the postal code does not have any registered case yet
    if (cases.length == 0) {
        const states = await fastify.models().ConfinementState.findAll({
            where: { show_in_summary: true },
            order: [["summary_order"]],
        });
        cases = states
            .map((state) => ({
                postalcode: postparts[0],
                confinement_state: state.id == 2 ? 300 : state.id,
                confinement_state_text: state.state_summary,
                hits: 0,
            }))
            .filter((state) => state.confinement_state != 3);
    }

    return cases;
  })
})

