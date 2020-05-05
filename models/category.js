'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING
  }, {});
  // 取得 category.Restaurant 方法
  Category.associate = function (models) {
    Category.hasMany(models.Restaurant)
  };
  return Category;
};