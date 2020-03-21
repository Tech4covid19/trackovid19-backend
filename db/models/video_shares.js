/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('video_shares', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		video_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'videos',
				key: 'id'
			}
		},
		target: {
			type: DataTypes.STRING,
			allowNull: false
		},
		share_link: {
			type: DataTypes.STRING,
			allowNull: false
		},
		share_order: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		available: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	}, {
		tableName: 'video_shares',
		timestamps: false
	});
};
