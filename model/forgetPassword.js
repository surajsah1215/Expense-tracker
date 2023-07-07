const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database')
const { v4: uuidv4 } = require('uuid');

const forgetPassword = sequelize.define('forgetPassword',{
    id:{
        type :DataTypes.UUID,
        allowNull: false,
        primaryKey:true
    },
    userId: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
})

module.exports = forgetPassword