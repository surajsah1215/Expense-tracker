const Expense  = require('../model/expense')

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
    res.status(201).json({data:data})

    }catch(err){
        console.log(err)
    }


}

exports.getExpense = async(req,res,next)=>{
    try{ 
        const expenses = await Expense.findAll({where:{userId:req.user.id}});
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