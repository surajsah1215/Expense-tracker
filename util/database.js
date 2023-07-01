const Sequilize = require('sequelize')

const sequelize = new Sequilize('expense-tracker','root','123456',{
    dialect:'mysql',
    host:'localhost',

})

module.exports = sequelize;