/* jshint indent: 1 */

const tools = require('../../tools/tools')

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('case', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.BIGINT,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'user_status',
				key: 'id'
			}
		},
		confinement_state: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'confinement_states',
				key: 'id'
			}
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
		tableName: 'history',
		timestamps: false
	});
};
