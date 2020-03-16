/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('history', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.STRING,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		status: {
			type: DataTypes.ENUM("infected","recovered","normal","quarentine","self quarentine"),
			allowNull: true
		},
		symptoms: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
		timestamp: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: 'timezone(utc)'
		},
		unix_ts: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: 'date_part(epoch)'
		}
	}, {
		tableName: 'history',
		timestamps: false
	});
};
