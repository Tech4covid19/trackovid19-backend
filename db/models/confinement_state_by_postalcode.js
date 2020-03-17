/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('confinement_states_by_postalcode', {
		postalcode: {
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
		hits: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'confinement_states_by_postalcode',
		timestamps: false
	});
};
