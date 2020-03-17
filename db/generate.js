const dotEnv = require('dotenv').config();

const SequelizeAuto = require('sequelize-auto')

var auto = new SequelizeAuto(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    //tables: ['users', 'history', 'network', 'confinement_states', 'symptoms', 'user_status', 'user_symptoms'],
    directory: __dirname + '/models'
})

auto.run(function (err) {
    if (err) throw err;
    console.log(auto.tables);
    console.log(auto.foreignKeys);
});