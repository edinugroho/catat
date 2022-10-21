'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transaction.init({
    id_user: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    notes: DataTypes.STRING,
    date: DataTypes.DATE,
    type: DataTypes.ENUM('income', 'expense')
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};