const Expense  = require('../model/expense')

exports.AddExpense = async(req,res,next)=>{
    try{
    const amount = req.body.amount
    const description = req.body.description
    const category = req.body.category
    
    const data = await Expense.create({
        amount:amount,
        description:description,
        category:category
    })
    res.status(201).json({data:data})

    }catch(err){
        console.log(err)
    }


}

exports.getExpense = async(req,res,next)=>{
    try{ 
        const expenses = await Expense.findAll();
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
    await Expense.destroy({where:{id:id}})
    res.sendStatus(200)
    }
    catch(err){
        res.json(err)
    }
}