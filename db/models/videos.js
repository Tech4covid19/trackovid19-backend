/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('videos', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false
		},
		video: {
			type: DataTypes.STRING,
			allowNull: false
		},
		video_order: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		available: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	}, {
		tableName: 'videos',
		timestamps: false
	});
};
