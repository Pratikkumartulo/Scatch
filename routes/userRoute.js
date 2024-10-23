const express = require("express");
const router = express.Router();
const {isLoggedIn} = require("../middlewares/userVerify")
const {registerUser,loginUser,logoutUser,rendercart,makeOrder,orderPage} = require("../controllers/userAuthent")
const {CancelOrder} = require("../controllers/orderControl")
const orderModel = require("../models/orderModel")
const {addReview} = require('../controllers/reviewControl')
const productModel = require("../models/productModel");
const { UpdateProduct,Searchfind } = require("../controllers/productControl");

router.get("/register",(req,res)=>{
  res.render("register")
})
router.get("/cart",isLoggedIn,rendercart)

router.post("/register",registerUser);

router.post("/login",loginUser);

router.get("/logout",logoutUser);

router.get("/order",isLoggedIn,orderPage)

router.post("/order",isLoggedIn,makeOrder)

router.post("/cancelorder/:orderid",isLoggedIn,CancelOrder)

router.post("/revieworder/:orderid",isLoggedIn,addReview)

router.get("/product/search", isLoggedIn,Searchfind);

module.exports = router;
