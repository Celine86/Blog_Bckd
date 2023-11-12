'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      models.Category.belongsTo(models.Post, {
        foreignKey: {
          allowNull: false
    }, onDelete:'NO ACTION',
      })
      models.Category.hasMany(models.Post);
    }
  };
  Category.init({
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    ifHasParent: { type: DataTypes.STRING, allowNull: true },
    nbOfPosts: { type: DataTypes.INTEGER, allowNull: true },
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};