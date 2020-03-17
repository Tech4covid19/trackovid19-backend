/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user_symptoms', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		history_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'history',
				key: 'id'
			}
		},
		symptom_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'symptoms',
				key: 'id'
			}
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
		tableName: 'user_symptoms',
		timestamps: false
	});
};
