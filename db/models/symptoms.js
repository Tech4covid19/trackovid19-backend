/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('symptoms', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		symptom: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		tableName: 'symptoms',
		timestamps: false
	});
};
