const Sequilize = require('sequelize')


const sequelize = new Sequilize(process.env.DB_NAME,process.env.DB_USER_NAME,process.env.DB_PASS,{
    dialect:'mysql',
    host: process.env.HOST,

})

module.exports = sequelize;