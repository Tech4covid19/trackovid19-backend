/* jshint indent: 1 */

const tools = require('../../tools/tools')

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('users', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		hash: {
			type: "BYTEA",
			allowNull: true
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
		patient_token: {
			type: DataTypes.STRING,
			allowNull: true
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		postalcode: {
			type: DataTypes.VIRTUAL,
			get () { 
				return tools.buildPostalCode(this.getDataValue('postalcode1'), this.getDataValue('postalcode2'));
			}
		},
		postalcode1: {
			type: DataTypes.STRING,
			allowNull: true
		},
		postalcode2: {
			type: DataTypes.STRING,
			allowNull: true
		},
		latitude: {
			type: DataTypes.DOUBLE,
			allowNull: true
		},
		longitude: {
			type: DataTypes.DOUBLE,
			allowNull: true
		},
		info: {
			type: DataTypes.STRING,
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
		optin_health_geo: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
		optin_health_geo_ts: {
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
		last_login: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: 'timezone(utc)'
		},
		has_symptoms: {
			type: DataTypes.VIRTUAL,
			set (valueToBeSet) { 
				this.setDataValue('has_symptoms', valueToBeSet);
			}
		},
		has_symptoms_text: {
			type: DataTypes.VIRTUAL,
			set (valueToBeSet) { 
				this.setDataValue('has_symptoms_text', valueToBeSet);
			}
		},
		confinement_state: {
			type: DataTypes.VIRTUAL,
			set (valueToBeSet) { 
				this.setDataValue('confinement_state', valueToBeSet);
			}
		},
		name: {
			type: DataTypes.VIRTUAL,
			set (valueToBeSet) { 
				this.setDataValue('name', valueToBeSet);
			},
			get () { 
				return this.getDataValue('name');
			}
		},
		email: {
			type: DataTypes.VIRTUAL,
			set (valueToBeSet) { 
				this.setDataValue('email', valueToBeSet);
			},
			get () { 
				return this.getDataValue('email');
			}
		},
		phone: {
			type: DataTypes.VIRTUAL,
			set (valueToBeSet) { 
				this.setDataValue('phone', valueToBeSet);
			},
			get () { 
				return this.getDataValue('phone');
			}
		},
		show_onboarding: {
			type: DataTypes.VIRTUAL,
			set (valueToBeSet) { 
				this.setDataValue('show_onboarding', valueToBeSet);
			},
			get () { 
				return this.getDataValue('show_onboarding');
			}
		},
		personal_hash: {
			type: DataTypes.VIRTUAL,
			set (valueToBeSet) { 
				this.setDataValue('personal_hash', valueToBeSet);
			},
			get () { 
				return this.getDataValue('personal_hash');
			}
		},
		health_hash: {
			type: DataTypes.VIRTUAL,
			set (valueToBeSet) { 
				this.setDataValue('health_hash', valueToBeSet);
			},
			get () { 
				return this.getDataValue('health_hash');
			}
		}
	  
	}, {
		tableName: 'users',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	});
};
