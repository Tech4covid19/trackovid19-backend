/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('postal_code_descriptions', {
		postal_number: {
			type: DataTypes.STRING,
            allowNull: true,
            primaryKey: true
		},
        description: {
			type: DataTypes.STRING,
            allowNull: true
		}
	}, {
		tableName: 'postal_code_descriptions',
		timestamps: false
	});
};
