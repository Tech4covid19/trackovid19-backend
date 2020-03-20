/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('users', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		hash: {
			type: "BYTEA",
			allowNull: true
		},
		facebook_id: {
			type: "BYTEA",
			allowNull: true
		},
		patient_token: {
			type: DataTypes.STRING,
			allowNull: true
		},
		show_onboarding: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		postalcode: {
			type: DataTypes.STRING,
			allowNull: true
		},
		ip: {
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
		timestamp: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: 'timezone(utc)'
		},
		unix_ts: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: 'date_part(epoch)'
		}
	}, {
		tableName: 'users',
		timestamps: false
	});
};
