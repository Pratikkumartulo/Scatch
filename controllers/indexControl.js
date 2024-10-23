const {isLoggedIn} = require("../middlewares/userVerify")
const productModel  = require("../models/productModel")

module.exports.renderShop = async(req,res)=>{
    try{
        let user = req.user;
        let products = await productModel.find()
        let success = req.flash("success")
        let error = req.flash("error")
        res.render("shop",{products,success,error,user});
    }catch(err){
      req.flash("error","Some Error occured");
      res.redirect("/")
    }
}

module.exports.renderLogin = (req,res)=>{
    try{
        let errorl= req.flash("error")
        let success= req.flash("success")
        res.render("index",{errorl,success});
    }catch(err){
      req.flash("error","Some Error occured");
      res.redirect("/user/register")
    }
}