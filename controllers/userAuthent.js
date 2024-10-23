const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const {genrateToken} = require("../utils/generateToken")
const orderModel = require("../models/orderModel")
const productModel = require("../models/productModel")

module.exports.registerUser = async (req, res) => {
    try{
        let {fullname,email,password,contact} = req.body;
        let user = await userModel.findOne({email:email})
        if(user) return res.send("User already exists")
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt,async function(err, hash) {
                if(err) return res.send(err.messsage)
                else{
                    let createdUser = await userModel.create({
                      fullname,
                      email,
                      password:hash,
                      contact
                    });
                   let token = genrateToken(createdUser)
                   res.cookie("token",token)
                   res.redirect("/shop")
                }
            });
        });
    }
    catch(err){
      req.flash("error",err.message);
      res.redirect("/")
    }
}

module.exports.loginUser = async function(req,res){
  try{
    
    let {email, password} = req.body
    let user = await userModel.findOne({email:email})
    if(!user){
        req.flash("error","Invalid email or password");
        res.redirect("/")
    }
    else{
        bcrypt.compare(password,user.password,function(err,result){
            if(result){
                let token = genrateToken(user)
                res.cookie("token",token)
                req.flash("success","Successfully Logged in");
                res.redirect("/shop")
            }else{
                req.flash("error","Invalid email or password");
                res.redirect("/")
            }
        })
    }
  }catch(err){
    req.flash("error","Some Error occured !")
    res.redirect("/")
  }
}

module.exports.logoutUser = (req,res)=>{
  try{
    res.clearCookie("token");
    req.flash("success","Successfully logged out");
    res.redirect("/")
  }catch(err){
    req.flash("error","Some Error occured");
    res.redirect("/")
  }
}

module.exports.rendercart = async(req,res)=>{
  try{
    const cartProducts = await userModel.findOne({email:req.user.email}).populate('cart')
    res.render("cart",{cartProducts});
  }catch(err){
    req.flash("error","Some Error occured");
    res.redirect("/")
  }
}

module.exports.makeOrder = (req,res)=>{
  try{
    const cart = req.user.cart
    cart.forEach(async prod => {
      let madeproduct = await productModel.findOne({_id:prod})
      const ordered = await orderModel.create({
        userId: req.user.id,
        image : madeproduct.image,
        name:madeproduct.name,
        price:madeproduct.price,
        discount:madeproduct.discount,
        productId:prod
      })
      const updateUser = await userModel.findByIdAndUpdate({ _id: req.user.id },
        { $push: { orders: ordered._id } },
        { new: true })
    });
    res.redirect("/shop")
  }catch(err){
    req.flash("error","Some Error occured");
    res.redirect("/")
  }
}

module.exports.orderPage = async(req,res)=>{
  try{
    let errorl= req.flash("error")
    let success= req.flash("success")
    const orderinfo = await orderModel.find({userId : req.user.id})
    res.render("order",{orderinfo,errorl,success})
  }catch(err){
    req.flash("error","Some Error occured");
    res.redirect("/")
  }
}