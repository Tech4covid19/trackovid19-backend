/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('push_subscriptions', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		push_type: {
			type: DataTypes.STRING,
			allowNull: false
		},
		endpoint: {
			type: DataTypes.STRING,
			allowNull: false
		},
		keys: {
			type: DataTypes.STRING,
			allowNull: false
		},
		send_error_count: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		tableName: 'push_subscriptions',
		timestamps: false
	});
};
