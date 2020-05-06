'use strict';
module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING
  }, {});
  // 取得 restaurant.Category 方法
  Restaurant.associate = function (models) {
    Restaurant.belongsTo(models.Category)
    Restaurant.hasMany(models.Comment)
  };
  return Restaurant;
};