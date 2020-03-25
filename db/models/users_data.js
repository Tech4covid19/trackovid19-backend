/* jshint indent: 1 */

const tools = require('../../tools/tools')

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('users_data', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		external_id: {
			type: DataTypes.STRING,
			allowNull: true
		},
		external_id_provider_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'external_id_providers',
				key: 'id'
			}
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true
		},
		show_onboarding: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
		optin_download_use: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
		optin_download_use_ts: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: 'timezone(utc)'
		},
		optin_privacy: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
		optin_privacy_ts: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: 'timezone(utc)'
		},
		optin_push: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
		optin_push_ts: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: 'timezone(utc)'
		},
		symptoms_updated_at: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: 'timezone(utc)'
		}
	}, {
		tableName: 'users_data',
		timestamps: false
	});
};
