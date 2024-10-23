const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const ownerModel = require("../models/ownersModel");
const {genrateToken} = require("../utils/generateToken");
const productModel = require("../models/productModel")
const orderModel = require("../models/orderModel")

module.exports.onwerLogin = async (req,res)=>{
    let {email,password} = req.body;
    let owner = await ownerModel.findOne({email:email})
    if(!owner){
        req.flash("error","Invalid Admin Id or passowrd")
        res.redirect("/owner");
    }else{
      bcrypt.compare(password,owner.password,function(err,result){
            if(result){
              let token = genrateToken(owner)
              res.cookie("owntoken",token)
              req.flash("success","Logged in Successfully")
              res.redirect("/owner/admin")
          }else{
            req.flash("error","Invalid Admin Id or passowrd")
            res.redirect("/owner");
          }
        })
      }
    }

module.exports.logoutOwner = (req,res)=>{
    try{
        res.clearCookie("owntoken");
        req.flash("success","Successfully logged out");
        res.redirect("/")
    }catch(err){
      req.flash("error","Some Error occured");
      res.redirect("/")
    }
}

module.exports.renderAdmin = async (req, res) => {
    try{
        let products = await productModel.find();
        let error = req.flash("error");
        let success = req.flash("success");
        res.render("admin", { success, products,error });
    }catch(err){
      req.flash("error","Some Error occured");
      res.redirect("/owner")
    }
  }

  module.exports.loginOwner = (req, res) => {
    try{
        let error = req.flash("error");
        res.render("owner-login", { error });
    }catch(err){
      req.flash("error","Some Error occured");
      res.redirect("/")
    }
  }

  module.exports.OrdersPage = async (req,res)=>{
    try{
        const orders =  await orderModel.find().populate("userId","email")
        res.render("orderControl",{orders})
    }catch(err){
      req.flash("error","Some Error occured");
      res.redirect("/owner/admin")
    }
  }
