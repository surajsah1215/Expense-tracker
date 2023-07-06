const Expense  = require('../model/expense')
const User = require('../model/user')

exports.premiumFeature =async (req,res,next)=>{

    try{
    const expense = await Expense.findAll()
    const user =await User.findAll()

    const data = {}
    expense.forEach(element => {
        if(data[element.userId]){
            data[element.userId] += element.amount 
        }
        else{
        data[element.userId] = element.amount
         }
    });
    const arr = []
    user.forEach(elem=>{
        arr.push({name:elem.name,tot_amount:data[elem.id]||0})
    })
    arr.sort((a,b)=>{
        b.tot_amount - a.tot_amount

    })
    res.status(200).json({"data":arr})


}catch(err){
    res.status(500).json({"err":err})
}

}