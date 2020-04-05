/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('share_images_by_postalcode', {
        postalcode: {
            field: 'postalcode1',
            type: DataTypes.STRING,
            allowNull: true,
            primaryKey: true,
        },
        image_hash: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'share_images_by_postalcode',
        timestamps: false,
    })
}
