const fp = require('fastify-plugin')

module.exports = fp(async (fastify, opts) => {
    fastify.decorate('models', () => {
        const Case = fastify.sequelize.import('../db/models/history.js');
        const Network = fastify.sequelize.import('../db/models/network.js');
        const Users = fastify.sequelize.import('../db/models/users.js');
        const UsersData = fastify.sequelize.import('../db/models/users_data.js');
        const Symptom = fastify.sequelize.import('../db/models/symptoms.js');
        const UserSymptom = fastify.sequelize.import('../db/models/user_symptoms.js');
        const ConfinementState = fastify.sequelize.import('../db/models/confinement_states.js');
        const Condition = fastify.sequelize.import('../db/models/user_status.js');
        const StatusByPostalCode = fastify.sequelize.import('../db/models/status_by_postalcode.js');
        const ConfinementStateByPostalCode = fastify.sequelize.import('../db/models/confinement_state_by_postalcode.js');

        //relationships
        Case.belongsTo(Users, { foreignKey: 'user_id' });
        Users.hasMany(Case, { foreignKey: 'user_id' });

        Users.hasMany(Network, { foreignKey: 'user_id' });
        Network.belongsTo(Users, { foreignKey: 'user_id' });

        Symptom.hasMany(UserSymptom, { foreignKey: 'symptom_id' });
        Case.hasMany(UserSymptom, { foreignKey: 'case_id' });
        UserSymptom.belongsTo(Case, { foreignKey: 'case_id' });

        return { Case, Network, Users, UsersData, Symptom, ConfinementState, Condition, StatusByPostalCode, ConfinementStateByPostalCode, UserSymptom }
    })
})
