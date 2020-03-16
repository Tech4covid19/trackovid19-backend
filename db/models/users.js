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
		age: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		city: {
			type: DataTypes.STRING,
			allowNull: true
		},
		ip: {
			type: DataTypes.STRING,
			allowNull: true
		},
		info: {
			type: DataTypes.STRING,
			allowNull: true
		},
		timestamp: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: 'timezone(utc'
		},
		unix_ts: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 'date_part(epoch'
		}
	}, {
		tableName: 'users'
	});
};
