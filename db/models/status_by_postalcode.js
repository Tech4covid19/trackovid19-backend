/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('status_by_postalcode', {
        postalcode: {
            field: 'postalcode1',
            type: DataTypes.STRING,
            allowNull: true,
            primaryKey: true,
        },
        postalcode_description: {
            field: 'postalcode_description',
            type: DataTypes.STRING,
            allowNull: true,
            primaryKey: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true,
            references: {
                model: 'user_status',
                key: 'id',
            },
        },

        status_text: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        summary_order: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        hits: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        latest_status_ts: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: 'timezone(utc)',
        },
    }, {
		tableName: 'status_by_postalcode',
		timestamps: false
	});
};
