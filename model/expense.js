const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database')

const Expense = sequelize.define('expenses',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
    amount: DataTypes.STRING,
    description: DataTypes.STRING,
    category: DataTypes.STRING
})

module.exports = Expense