const express = require("express")
const router = express.Router()
const {isLoggedIn} = require("../middlewares/userVerify")
const productModel  = require("../models/productModel")
const {renderShop,renderLogin} = require("../controllers/indexControl")

router.get("/",renderLogin)

router.get("/shop",isLoggedIn,renderShop)

module.exports = router