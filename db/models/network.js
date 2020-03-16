/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('network', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 'nextval(network_id_seq::regclass)'
		},
		user_id: {
			type: DataTypes.STRING,
			allowNull: true
		},
		met_with: {
			type: DataTypes.STRING,
			allowNull: true
		},
		facebook_id: {
			type: "BYTEA",
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
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 'date_part(epoch)'
		}
	}, {
		tableName: 'network',
		timestamps: false
	});
};
