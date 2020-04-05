/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('confinement_states_by_postalcode', {
		postalcode: {
			field: 'postalcode1',
			type: DataTypes.STRING,
            allowNull: true,
            primaryKey: true
		},
		confinement_state: {
			type: DataTypes.INTEGER,
			allowNull: true,
            primaryKey: true,
			references: {
				model: 'user_status',
				key: 'id'
			}
		},
		postalcode_description: {
			type: DataTypes.STRING,
			allowNull: true
		},
		confinement_state_text: {
			type: DataTypes.STRING,
			allowNull: true
		},
		summary_order: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		hits: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'confinement_states_by_postalcode',
		timestamps: false
	});
};
