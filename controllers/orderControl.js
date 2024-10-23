const orderModel = require("../models/orderModel")

module.exports.ChangeStatus = async (req,res)=>{
    try{
        const order = await orderModel.findByIdAndUpdate({_id:req.params.orderid},{status:req.body.Status})
        res.redirect("/owner/orders")
    }catch(err){
      req.flash("error","Some Error occured");
      res.redirect("/owner/orders")
    }
}

module.exports.CancelOrder = async (req,res)=>{
    try{
        const order = await orderModel.findByIdAndUpdate({_id:req.params.orderid},{status:"Canceled"})
        res.redirect("/user/order")
    }catch(err){
      req.flash("error","Some Error occured");
      res.redirect("/user/order")
    }
  }