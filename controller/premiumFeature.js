const Expense  = require('../model/expense')
const User = require('../model/user')
const sequelize = require('../util/database')

exports.premiumFeature =async (req,res,next)=>{

    try{
    // const expense = await Expense.findAll({
    //     attributes : ['userId',[sequelize.fn('sum',sequelize.col('expenses.amount')),'total_amount']],
    //     group : ['userId']
    // })
    
    // const getuserLeaderBoard =await User.findAll({
    //     attributes : ['id','name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'total_amount']],
    //     include:[
    //         {
    //             model : Expense,
    //             attributes : []
    //         }
    //     ],
    //     group:['users.id'],
    //     order:[['total_amount','DESC']]
    // })
    const getuserLeaderBoard = await User.findAll({
        attributes : ['name','total_amount'],
        order:[['total_amount','DESC']]
    })

    res.status(200).json({"data":getuserLeaderBoard})


}catch(err){
    res.status(500).json({"err":err})
}

}