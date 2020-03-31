'use strict'

const g = require('./services/image-generator')
const date = new Date()
const data = {
    city_name: 'Porto',
    postal_code: '4445-656',
    last_update: `Estado em 31 de Março de 2020, às 18:00`,
    infectados_value: 123,
    recuperados_value: 25,
    suspeitos_value: 325,
    com_sintomas_value: 456,
    sem_sintomas_value: 654,
    em_casa_value: 987,
    rotina_habitual_value: 147,
    isolados_value: 852,
}
g.dashboard(data)
