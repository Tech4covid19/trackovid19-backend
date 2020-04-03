'use strict'

const tools = require('../../../tools/tools')
const crypto = require('crypto')
const awsService = require('../../../services/aws-service')
const imgGeneratorService = require('../../../services/image-generator')

module.exports = async (fastify) => {

    fastify.get('/status/:postalCode', {
        preValidation: [fastify.authenticate],
        schema: {
            tags: ['case'],
            params: fastify.schemas().getGeoCases,
        },
    }, async (request, reply) => {
        try {
            // Decode postal code
            const postparts = tools.splitPostalCode(request.params.postalCode)
            // get condition cases
            var cases1 = await fastify.models().StatusByPostalCode.findAll({
                where: {postalcode1: postparts[0]},
                order: [['summary_order']],
            })

            // Fallback when the postal code does not have any registered case yet
            if (cases1.length === 0) {
                const conditions = await fastify.models().Condition.findAll({
                    where: {show_in_summary: true},
                    order: [['summary_order']],
                })
                cases1 = [
                    {
                        postalcode: postparts[0],
                        status: 100,
                        status_text: 'Com sintomas',
                        hits: 0,
                    },
                    {
                        postalcode: postparts[0],
                        status: 200,
                        status_text: 'Sem sintomas',
                        hits: 0,
                    },
                ].concat(conditions.map(cond => ({
                    postalcode: postparts[0],
                    status: cond.id,
                    status_text: cond.status_summary,
                    hits: 0,
                })))
            }

            var cases2 = await fastify.models().
                ConfinementStateByPostalCode.
                findAll({
                    where: {postalcode1: postparts[0]},
                    order: [['summary_order']],
                })

            // Fallback when the postal code does not have any registered case yet
            if (cases2.length === 0) {
                const states = await fastify.models().ConfinementState.findAll({
                    where: {show_in_summary: true},
                    order: [['summary_order']],
                })
                cases2 = states.map(state => ({
                    postalcode: postparts[0],
                    confinement_state: (state.id == 2 ? 300 : state.id),
                    confinement_state_text: state.state_summary,
                    hits: 0,
                })).filter(state => state.confinement_state != 3)
            }

            const cases = [...cases1, ...cases2]

            const caseHash = crypto.createHmac('sha256', cases.toString())
            let cs = cases.find(cs => cs.status === 100)
            let pc = cs.postalcode
            let cn = cs.postalcode_description
            let sus = cases.find(cs => cs.status === 2)
            let rec = cases.find(cs => cs.status === 3)
            let inf = cases.find(cs => cs.status === 1)

            let ss = cases.find(cs => cs.confinement_state === 1)
            let iso = cases.find(cs => cs.confinement_state === 300)
            let tfc = cases.find(cs => cs.confinement_state === 4)
            let ecp = cases.find(cs => cs.confinement_state === 1)

            const data = {
                city_name: cn,
                postal_code: pc,
                last_update: string,
                infectados_value: inf.hits,
                recuperados_value: rec.hits,
                suspeitos_value: sus.hits,
                com_sintomas_value: cs.hits,
                sem_sintomas_value: ss.hits,
                em_casa_value: ecp.hits,
                rotina_habitual_value: tfc.hits,
                isolados_value: iso.hits,
            }

            let buffer = imgGeneratorService.dashboard(data)
            let fileURL = awsService.S3.storeS3(buffer, caseHash + '.png')
            return fileURL

        } catch (error) {
            request.log.error(error)
        }
    })
}
