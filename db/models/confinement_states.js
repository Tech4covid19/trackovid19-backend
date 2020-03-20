/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('confinement_states', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		state: {
			type: DataTypes.STRING,
			allowNull: true
		},
		state_summary: {
			type: DataTypes.STRING,
			allowNull: true
		},
		description: {
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
		tableName: 'confinement_states',
		timestamps: false
	});
};
