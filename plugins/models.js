const fp = require('fastify-plugin')

module.exports = fp(async (fastify, opts) => {
    fastify.decorate('models', () => {
        const Case = fastify.sequelize.import('../db/models/history.js');
        const Network = fastify.sequelize.import('../db/models/network.js');
        const Users = fastify.sequelize.import('../db/models/users.js');

        //relationships       
        Case.belongsTo(Users, { foreignKey: 'id' });
        Users.hasMany(Case, { foreignKey: 'user_id' });
        
        Users.hasMany(Network, { foreignKey: 'user_id' });
        Network.belongsTo(Users, { foreignKey: 'id' });


        return { Case, Network, Users }
    })
})