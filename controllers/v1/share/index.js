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

            var cases = await fastify.models().StatusByPostalCode.findAll({
                where: {postalcode1: postparts[0]},
                order: [['summary_order']],
            })

            // Fallback when the postal code does not have any registered case yet
            if (cases.length == 0) {
                const conditions = await fastify.models().Condition.findAll({
                    where: {show_in_summary: true},
                    order: [['summary_order']],
                })
                cases = [
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

            const caseHash = crypto.createHmac('sha256', cases.toString())
            const data = {
                city_name: cases,
                postal_code: string,
                last_update: string,
                infectados_value: string,
                recuperados_value: string,
                suspeitos_value: string,
                com_sintomas_value: string,
                sem_sintomas_value: string,
                em_casa_value: string,
                rotina_habitual_value: string,
                isolados_value: string,
            }
            let buffer = imgGeneratorService.dashboard(data)
            let fileURL = awsService.S3.storeS3(buffer, caseHash + '.png')

        } catch (error) {
            request.log.error(error)
        }
    })
}
