'use strict'

const cheerio = require('cheerio')
const fs = require('fs')
const svg2img = require('svg2img')

async function generateImage (svg, data) {
    // based on the data change the svg
    const $ = cheerio.load(svg)
    for (let field in data) {
        if (data.hasOwnProperty(field)) {
            $(filed).text(data[field])
        } else {
            throw Error(`Error: field ${field} is missing`)
        }

    }
    const finalSvg = $.xml()
    // generate an image based on updated svg source.
    // TODO: extract to function and add option for multiple formats
    let buffer = svg2img(finalSvg, function (error, buffer) {
        if (error) {
            throw error
        }
        //returns a Buffer
        return buffer
    })

    // call S3 to store image
    // temporary to test image generations first
    fs.writeFileSync('/resources/dashboard.png', buffer)

    // return image URL
    return '/resources/dashboard.png'

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
    const img = '/resources/Share_image_dashboard.svg'

    const svg = await fs.readFile(img, (err, data) => {
        if (err) {
            throw err
        }
        return data.toString()
    })

    // Add the required fields for data validation
    const fields = {
        // city_name
        city_name: data.city_name,
        // postal_code
        postal_code: data.postal_code,
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
        rotina_habitual_title: data.rotina_habitual_title || 'Rotina Habitual',
        // rotina_habitual_value
        rotina_habitual_value: data.rotina_habitual_value,
        // isolados_title
        isolados_title: data.isolados_title || 'Isolados',
        // isolados_value
        isolados_value: data.isolados_value,
        // isolamento
        isolamento: data.isolamento || 'Isonamento',
    }

    return await generateImage(svg, fields)
}

module.exports = {
    dashboard: generateDashboard,
}
