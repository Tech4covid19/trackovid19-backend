/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('example', {
		user_id: {
			type: DataTypes.STRING,
			allowNull: true
		},
		inteiro: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		numerico: {
			type: DataTypes.DOUBLE,
			allowNull: true
		},
		bytes: {
			type: "BYTEA",
			allowNull: false
		},
		texto: {
			type: DataTypes.STRING,
			allowNull: true
		},
		list_of_3_ints: {
			type: "ARRAY",
			allowNull: true
		},
		list_of_ints: {
			type: "ARRAY",
			allowNull: true
		},
		authorized: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		timestamp: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: 'timezone(utc)'
		},
		unix_timestamp: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 'date_part(epoch)'
		}
	}, {
		tableName: 'example',
		timestamps: false
	});
};
