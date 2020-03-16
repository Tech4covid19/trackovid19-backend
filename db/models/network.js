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
			allowNull: true,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		met_with: {
			type: DataTypes.STRING,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id'
			}
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
		tableName: 'network'
	});
};
