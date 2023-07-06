const Expense  = require('../model/expense')
const User = require('../model/user')

exports.AddExpense = async(req,res,next)=>{
    try{
    const amount = req.body.amount
    const description = req.body.description
    const category = req.body.category
    
    const data = await Expense.create({
        amount:amount,
        description:description,
        category:category,
        userId : req.user.id
    })
    const user = await User.findOne({where:{id:req.user.id}})
    total_amount  = Number(user.total_amount) + Number(amount)
    user.update({total_amount:total_amount})
    res.status(201).json({data:data})

    }catch(err){
        console.log(err)
    }


}

exports.getExpense = async(req,res,next)=>{
    try{ 
        if(!req.user.id){
            return new Error('no data found')
        }
        const expenses = await Expense.findAll({where:{userId:req.user.id}});
        // if(!expenses){
        //     throw new Error('no data found')
        // }
        res.json({
            expenses
        })
    }catch(err){
        console.log(err)
        res.sendStatus(500).json({error:err});

    }
}

exports.deleteExpense = async(req,res,next)=>{
    try{
    const id = req.params.expenseId
    await Expense.destroy({where:{id:id,userId:req.user.id}}).then(noofrowsdeleted=>{
        console.log(noofrowsdeleted)
        if(noofrowsdeleted==0){
            res.status(404).json({sucess:false,message:'Expense doesnt belong to the user'})
        }
        else{
            // const user =  User.findOne({where:{id:req.user.id}})
            // user_amount = Expense.findOne({where:{id:id}})
            // total_amount  = Number(user.total_amount) - Number(user_amount.amount)
            // console.log("user>>>",user)
            // console.log(user_amount.amount,user.total_amount)
            // user.update({total_amount:total_amount})
        res.status(200).json({sucess:true,message:'Deleted sucessfully'})
        }
        
    }).catch(err=>{
        console.log(err)
    })
    

    }
    catch(err){
        res.json(err)
    }
}