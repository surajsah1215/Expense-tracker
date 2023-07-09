const { resolve } = require('path')
const Expense  = require('../model/expense')
const User = require('../model/user')
const sequelize = require('../util/database')
const AWS = require('aws-sdk')
const { rejects } = require('assert')

exports.AddExpense = async(req,res,next)=>{
    try{
    const t = await sequelize.transaction()
    const amount = req.body.amount
    const description = req.body.description
    const category = req.body.category
    
    const data = await Expense.create({
        amount:amount,
        description:description,
        category:category,
        userId : req.user.id
    },{tramsaction:t})
    // const user = await User.findOne({where:{id:req.user.id},tramsaction:t})
    total_amount  = Number(req.user.total_amount) + Number(amount)
    await User.update({total_amount:total_amount},{where:{id:req.user.id},tramsaction:t})
    await t.commit()
    res.status(201).json({data:data})

    }catch(err){
       await t.rollback()
        return res.status(500).json({"err":err})
    }


}

exports.getExpense = async(req,res,next)=>{
    try{ 
        if(!req.user.id){
            return new Error('no data found')
        }
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
        const t = await sequelize.transaction()
        const id = req.params.expenseId
        const expenseuser = await Expense.findOne({where:{id:id,userId:req.user.id}})
        const noofrowsdeleted= await Expense.destroy({where:{id:id,userId:req.user.id},tramsaction:t})
        if(noofrowsdeleted==0){
            res.status(404).json({sucess:false,message:'Expense doesnt belong to the user'})
        }
        else{
            total_amount  = Number(req.user.total_amount) - Number(expenseuser.amount)
            await User.update({total_amount:total_amount},{where:{id:req.user.id}})
            await t.commit()
           
        res.status(200).json({sucess:true,message:'Deleted sucessfully'})
        }
  
    }
    catch(err){
        await t.rollback()
        res.json(err)
    }
}
function uploadToS3(data,fileName){

try{
    const BUCKET_NAME = 'appexpense'
    const IAM_USER_KEY = 'AKIAX3AO5FEWZD26TKVV'
    const IAM_USER_SECRET ='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'

    let s3bucket = new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
    })

   
        var params = {
            Bucket : BUCKET_NAME,
            Key:fileName,
            Body:data,
            ACL:'public-read'

        }
        return new Promise((resolve,reject)=>{
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    reject(err)
                }
                else{
                    resolve(s3response.Location)
                }
            })
        })
 }catch(err){
    res.status(500).json({'err':err})
 }
    

}

exports.downloadExpense = async(req,res)=>{
    try{
    const expenses = await req.user.getExpenses()
    const stringifieldExpenses = JSON.stringify(expenses)
    const userId = req.user.id
    const fileName =  `Expense${userId}/${new Date()}.txt`
    const fileUrl = await uploadToS3(stringifieldExpenses,fileName)
    res.status(200).json({fileUrl,sucess:true})

 }catch(err){
    console.log(err)
 }
}

