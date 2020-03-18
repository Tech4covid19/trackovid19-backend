/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('case', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.STRING,
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
