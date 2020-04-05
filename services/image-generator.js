'use strict'

const cheerio = require('cheerio')
const fs = require('fs')
const svg2img = require('svg2img')

async function generateImage (svg, data) {
    console.log('Started generating image')
    try {
        // based on the data change the svg
        const $ = cheerio.load(svg, {xml: true})

        for (let field in data) {
            if (data.hasOwnProperty(field)) {
                let f = `#${field}`
                $(f).text(data[field])
            } else {
                throw(`Error: field ${field} is missing`)
            }
        }
        const finalSvg = $.xml()
        // generate an image based on updated svg source.
        // TODO: extract to function and add option for multiple formats
        await svg2img(finalSvg.toString(), function (error, buffer) {
            console.log('generating PNG')
            if (error) {
                console.log(error)
                return error
            }
            console.log('internal buffer: ', buffer)
            return buffer
            //returns a Buffer
        })
    } catch (e) {
        console.log(e)
        return e
    }

}

/**
 *
 * @param data
 * @returns {Promise<string>}
 *
 * usage:
 * const data = {
 *     city_name: string
 *     postal_code: string
 *     last_update: string
 *     infectados_value: string
 *     recuperados_value: string
 *     suspeitos_value: string
 *     com_sintomas_value: string
 *     sem_sintomas_value: string
 *     em_casa_value: string
 *     rotina_habitual_value: string
 *     isolados_value: string
 *
 *     saude?: string
 *     infectados_title?: string
 *     recuperados_title?: string
 *     suspeitos_title?: string
 *     com_sintomas_title?: string
 *     sem_sintomas_title?: string
 *     em_casa_title?: string
 *     rotina_habitual_title?: string
 *     isolados_title?: string
 *     isolamento?: string
 *
 *
 * };
 * generateDashboard(data);
 */
async function generateDashboard (data) {
    console.log('Got to generate dasboard image')
    const img = __basedir + '/resources/Share_image_dashboard.svg'
    try {
        const svg = fs.readFileSync(img).toString()

        // Add the required fields for data validation
        const fields = {
            // city_name
            city_name: data.city_name,
            // postal_code
            postal_code: data.postal_code,
            // last_update
            last_update: data.last_update,
            // saude
            saude: data.saude || 'Saúde',
            // infectados_title
            infectados_title: data.infectados_title || 'Infectados',
            // infectados_value
            infectados_value: data.infectados_value,
            // recuperados_title
            recuperados_title: data.recuperados_title || 'Recuperados',
            // recuperados_value
            recuperados_value: data.recuperados_value,
            // suspeitos_title
            suspeitos_title: data.suspeitos_title || 'Suspeitos',
            // suspeitos_value
            suspeitos_value: data.suspeitos_value,
            // com_sintomas_title
            com_sintomas_title: data.com_sintomas_title || 'Com Sintomas',
            // com_sintomas_value
            com_sintomas_value: data.com_sintomas_value,
            // sem_sintomas_title
            sem_sintomas_title: data.sem_sintomas_title || 'Sem Sintomas',
            // sem_sintomas_value
            sem_sintomas_value: data.sem_sintomas_value,
            // DO NOT USE THE TITLE IT IS DOUBLE LINE STILL TRYING TO ADJUST ON THE SVG
            // em_casa_title
            // em_casa_title: data.em_casa_title || '',
            // em_casa_value
            em_casa_value: data.em_casa_value,
            // rotina_habitual_title
            rotina_habitual_title: data.rotina_habitual_title ||
                'Rotina Habitual',
            // rotina_habitual_value
            rotina_habitual_value: data.rotina_habitual_value,
            // isolados_title
            isolados_title: data.isolados_title || 'Isolados',
            // isolados_value
            isolados_value: data.isolados_value,
            // isolamento
            isolamento: data.isolamento || 'Isonamento',
        }
        // console.log('Fields: ', fields);

        return await generateImage(svg, fields)
    } catch (err) {
        return err
    }

}

module.exports = {
    dashboard: generateDashboard,
}
