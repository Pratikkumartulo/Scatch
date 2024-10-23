const orderModel = require("../models/orderModel")
const reviewModel = require("../models/reviewModel")

module.exports.addReview = async(req,res)=>{
    try{
        const updatedOrder = await orderModel.findByIdAndUpdate({_id:req.params.orderid},{review:req.body.review,ratting:req.body.rating},{new:true});
        const reviewOrder = await reviewModel.create({
        productId:updatedOrder.productId,
        userId: updatedOrder.userId,
        rating: req.body.rating,
        comment: req.body.review,
        })
        req.flash("success","review added successfully");
    }catch(err){
        req.flash("error",err.message);
    }
    res.redirect("/user/order")
  }