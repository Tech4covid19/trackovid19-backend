const fp = require('fastify-plugin')

module.exports = fp(async (fastify, opts) => {
    fastify.decorate('models', () => {
        const Case = fastify.sequelize.import('../db/models/history.js');
        const Network = fastify.sequelize.import('../db/models/network.js');
        const Users = fastify.sequelize.import('../db/models/users.js');
        const UsersData = fastify.sequelize.import('../db/models/users_data.js');
        const Symptom = fastify.sequelize.import('../db/models/symptoms.js');
        const UserSymptom = fastify.sequelize.import(
            '../db/models/user_symptoms.js')
        const ConfinementState = fastify.sequelize.import(
            '../db/models/confinement_states.js')
        const Condition = fastify.sequelize.import(
            '../db/models/user_status.js')
        const StatusByPostalCode = fastify.sequelize.import(
            '../db/models/status_by_postalcode.js')
        const ConfinementStateByPostalCode = fastify.sequelize.import(
            '../db/models/confinement_state_by_postalcode.js')
        const VideoShares = fastify.sequelize.import(
            '../db/models/video_shares.js')
        const Videos = fastify.sequelize.import('../db/models/videos.js')
        const PushSubscriptions = fastify.sequelize.import(
            '../db/models/push_subscriptions.js')
        const PostalCodeDescriptions = fastify.sequelize.import('../db/models/postal_code_descriptions.js')
        const ShareImagesByPostalcode = fastify.sequelize.import(
            '../db/models/share_images_by_postalcode.js')
        const PostalCodes = fastify.sequelize.import('../db/models/postal_codes.js');


        return {
            Case,
            Network,
            Users,
            UsersData,
            Symptom,
            ConfinementState,
            Condition,
            StatusByPostalCode,
            ConfinementStateByPostalCode,
            UserSymptom,
            Videos,
            VideoShares,
            PushSubscriptions,
            PostalCodeDescriptions,
            ShareImagesByPostalcode,
            PostalCodes
        }

    })

    fastify.decorate('setupModels', () => {
        const Case = fastify.sequelize.import('../db/models/history.js');
        const Network = fastify.sequelize.import('../db/models/network.js');
        const Users = fastify.sequelize.import('../db/models/users.js');
        const Symptom = fastify.sequelize.import('../db/models/symptoms.js');
        const UserSymptom = fastify.sequelize.import('../db/models/user_symptoms.js');
        const VideoShares = fastify.sequelize.import('../db/models/video_shares.js');
        const Videos = fastify.sequelize.import('../db/models/videos.js');
        const PushSubscriptions = fastify.sequelize.import('../db/models/push_subscriptions.js');
        const PostalCodeDescriptions = fastify.sequelize.import('../db/models/postal_code_descriptions.js');
        const ShareImagesByPostalcode = fastify.sequelize.import('../db/models/share_images_by_postalcode.js')
        const PostalCodes = fastify.sequelize.import('../db/models/postal_codes.js');

        console.log('Initializing models');

        //relationships
        Case.belongsTo(Users, { foreignKey: 'user_id'});
        Users.hasMany(Case, { foreignKey: 'user_id', as: 'cases' });

        Users.belongsTo(Case, { foreignKey: 'latest_status_id', as: 'latest_status' })
        
        Users.belongsTo(PostalCodeDescriptions, { foreignKey: 'postalcode1', as: 'pc_description' })

        Users.hasMany(Network, { foreignKey: 'user_id' });
        Network.belongsTo(Users, { foreignKey: 'user_id' });

        Symptom.hasMany(UserSymptom, { foreignKey: 'symptom_id' });
        Case.hasMany(UserSymptom, { foreignKey: 'case_id' });
        UserSymptom.belongsTo(Case, { foreignKey: 'case_id' });

        VideoShares.belongsTo(Videos, { foreignKey: 'video_id' });
        Videos.hasMany(VideoShares, { foreignKey: 'video_id' });

        Users.hasMany(PushSubscriptions, { foreignKey: 'user_id' });
        PushSubscriptions.belongsTo(Users, { foreignKey: 'user_id' });
    })
})
