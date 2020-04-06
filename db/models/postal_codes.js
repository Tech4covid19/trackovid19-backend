/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('postal_codes', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		postal_number: {
			type: DataTypes.STRING,
			allowNull: false
		},
		postal_extension: {
			type: DataTypes.STRING,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		municipality_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		district_name: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		tableName: 'pt_postal_codes',
		timestamps: false
	});
};
