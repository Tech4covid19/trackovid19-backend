/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('status_by_postalcode', {
		postalcode: {
			type: DataTypes.STRING,
            allowNull: true,
            primaryKey: true
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true,
            primaryKey: true,
			references: {
				model: 'user_status',
				key: 'id'
			}
        },
        status_text: {
			type: DataTypes.STRING,
            allowNull: true
		},
		hits: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'status_by_postalcode',
		timestamps: false
	});
};
