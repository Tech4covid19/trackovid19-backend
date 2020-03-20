/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user_status', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		status_summary: {
			type: DataTypes.STRING,
			allowNull: true
		},
		summary_order: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		show_in_summary: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		}

	}, {
		tableName: 'user_status',
		timestamps: false
	});
};
