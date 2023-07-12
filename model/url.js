const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database')

const Urltable = sequelize.define('urltable',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    
})


module.exports = Urltable;
