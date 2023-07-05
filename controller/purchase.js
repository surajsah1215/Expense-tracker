const Razorpay = require('razorpay')
const Order = require('../model/order')
require('dotenv').config();
 
exports.purchasePreimum = async(req,res)=>{
    try{
        var rzp = new Razorpay({
            key_id : process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        // console.log(rzp)
        const amount = 2500
        rzp.orders.create({amount,currency:"INR"},(err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err))
            }
            req.user.createOrder({orderid: order.id,status:'PENDING'}).then(()=>{
                return res.status(201).json({order,key_id:rzp.key_id})
            }).catch(err=>{
                throw new Error(err)
            })
        })
    }catch(err){
        console.log(err)
        res.status(403).json({message:'something went wrong',err:err})
    }
}

exports.updateTransactionState = async(req,res,next)=>{

    try{
        const {payment_id,order_id} = req.body
        console.log(payment_id)
        console.log(order_id)
        const order = await Order.findOne({where:{orderid:order_id}})
        const promise1 = order.update({payementid:payment_id,status:"SUCESSFUL"})
        const promise2 = req.user.update({ispremium:true})
                    
        Promise.all([promise1,promise2]).then(()=>{
            return res.json(202).json({sucess:true,message:"Transaction successful"})
        }).catch(err=>{
            throw new Error(err)
        })

    }catch(err){
        const {payment_id,order_id} = req.body
        const order = await Order.findOne({where:{orderid:order_id}})
        await order.update({payementid:payment_id,status:"Fail"})
        console.log(err)
        res.status(403).json({err:err,message:"payment is not happening"})
    }

}