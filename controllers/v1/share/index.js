'use strict'

const tools = require('../../../tools/tools')
const crypto = require('crypto')
const awsService = require('../../../services/aws-service')
const imgGeneratorService = require('../../../services/image-generator')

module.exports = async (fastify) => {

    fastify.get('/share/status/:postalCode', {
        preValidation: [fastify.authenticate],
        schema: {
            tags: ['case'],
            params: fastify.schemas().getGeoCases,
        },
    }, async (request, reply) => {
        console.log('reached /share/status/:postalcode with ',
            request.params.postalCode)
        try {
            // Decode postal code
            const postparts = tools.splitPostalCode(request.params.postalCode)
            // get condition cases
            var cases1 = await fastify.models().StatusByPostalCode.findAll({
                where: {postalcode1: postparts[0]},
                order: [['summary_order']],
            })
            var cases2 = await fastify.models().
                ConfinementStateByPostalCode.
                findAll({
                    where: {postalcode1: postparts[0]},
                    order: [['summary_order']],
                })

            const cases = [...cases1, ...cases2]

            console.log('cases: ', JSON.stringify(cases))
            // const caseHash = crypto.createHmac('sha256', cases.toString());
            console.log('creating hash...')
            let caseHash = crypto.createHash('sha1')
            caseHash.update(JSON.stringify(cases))

            const myHash = caseHash.digest('hex')

            console.log('hash for image: ', myHash)

            let data = {}
            // postalcode
            data.postal_code = cases[0].postalcode
            // city name
            data.city_name = cases[0].postalcode_description
            // Com sintomas
            let cs = cases.find(cs => cs.status === 100)
            data.com_sintomas_value = cs === undefined ? '0' : cs.hits
            // suspeitos
            let sus = cases.find(cs => cs.status === 2)
            data.suspeitos_value = sus === undefined ? '0' : sus.hits
            // recuperados
            let rec = cases.find(cs => cs.status === 3)
            data.recuperados_value = rec === undefined ? '0' : rec.hits
            // infectados
            let inf = cases.find(cs => cs.status === 1)
            data.infectados_value = inf === undefined ? '0' : inf.hits
            // sem sintomas
            let ss = cases.find(cs => cs.confinement_state === 200)
            data.sem_sintomas_value = ss === undefined ? '0' : ss.hits
            // isolados
            let iso = cases.find(cs => cs.confinement_state === 300)
            data.isolados_value = iso === undefined ? '0' : iso.hits
            // rotina habitual
            let tfc = cases.find(cs => cs.confinement_state === 4)
            data.rotina_habitual_value = tfc === undefined ? '0' : tfc.hits
            // Em casa preventivamente
            let ecp = cases.find(cs => cs.confinement_state === 1)
            data.em_casa_value = ecp === undefined ? '0' : ecp.hits

            // get latest date in cases response
            data.last_update = new Date(
                Math.max.apply(null, cases.map(function (e) {
                    return new Date(e.latest_status_ts)
                })))

            console.log('data to generate image: \n', data)

            console.log('going to generate the image')
            let buffer = await imgGeneratorService.dashboard(data)

            console.log('recieved buffer: ', buffer)
            console.log('storing it in S3')
            let fileURL = await awsService.S3.storeS3(buffer, myHash + '.png')

            console.log('returned url: ', fileURL)
            return fileURL

            reply.send({status: 'success'})

        } catch (error) {
            request.log.error(error)
        }
    })
}
