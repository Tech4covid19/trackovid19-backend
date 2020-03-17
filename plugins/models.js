const fp = require('fastify-plugin')

module.exports = fp(async (fastify, opts) => {
    fastify.decorate('models', () => {
        const Case = fastify.sequelize.import('../db/models/history.js');
        const Network = fastify.sequelize.import('../db/models/network.js');
        const Users = fastify.sequelize.import('../db/models/users.js');
        const Symptom = fastify.sequelize.import('../db/models/symptoms.js');
        const UserSymptom = fastify.sequelize.import('../db/models/user_symptoms.js');
        const ConfinementState = fastify.sequelize.import('../db/models/confinement_states.js');
        const Condition = fastify.sequelize.import('../db/models/user_status.js');

        //relationships       
        Case.belongsTo(Users, { foreignKey: 'id' });
        Users.hasMany(Case, { foreignKey: 'user_id' });
        
        Users.hasMany(Network, { foreignKey: 'user_id' });
        Network.belongsTo(Users, { foreignKey: 'id' });

        Symptom.hasMany(UserSymptom, { foreignKey: 'symptom_id' });
        Case.hasMany(UserSymptom, { foreignKey: 'history_id' });
        UserSymptom.belongsTo(Case, { foreignKey: 'id' });

        return { Case, Network, Users, Symptom, ConfinementState, Condition }
    })
})