/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('history', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 'nextval(history_id_seq::regclass)',
			primaryKey: true
		},
		user_id: {
			type: DataTypes.STRING,
			allowNull: true,
			primaryKey: true
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true
		},
		confinement_state: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true
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
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 'date_part(epoch)'
		}
	}, {
		tableName: 'history',
		timestamps: false
	});
};
