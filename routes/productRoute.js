const express = require("express")
const router = express.Router()
const upload = require("../config/multerConfig")
const {verifyOwner} = require("../middlewares/ownerVerify")
const { isLoggedIn } = require("../middlewares/userVerify")
const {createProduct,addToCart,removeProdCart,deleteProduct,deleteAll,updatepage,UpdateProduct} = require("../controllers/productControl");
const productModel = require("../models/productModel")

router.post("/Create",upload.single('image'),verifyOwner,createProduct)

router.post("/addcart/:productid",isLoggedIn,addToCart)

router.post("/removecart/:productId",isLoggedIn,removeProdCart)

router.get("/delete/:productid",verifyOwner,deleteProduct)

router.get("/deleteall",verifyOwner,deleteAll)

router.get("/update/:productid",verifyOwner,updatepage)

router.post("/update/:productid",verifyOwner,UpdateProduct)

module.exports = router