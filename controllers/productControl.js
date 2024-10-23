const upload = require("../config/multerConfig")
const productModel = require("../models/productModel")
const {verifyOwner} = require("../middlewares/ownerVerify")
const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken");
const { isLoggedIn } = require("../middlewares/userVerify")

module.exports.createProduct = async function (req,res){
    try{
        let {name,price,discount,bgColour,panelColor,textColor} = req.body;
        let createdProduct = await productModel.create({
            image:req.file.buffer,
            name,
            price,
            discount,
            bgColour,
            panelColor,
            textColor
        });
        req.flash("success","Product Created Successfully");
        res.redirect("/owner/createprod")
    }catch(err){
        req.flash("error","Something went wrong");
        res.redirect("/owner/createprod")
    }
}

module.exports.addToCart = async(req,res)=>{
    try{
        productid = req.params.productid;
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: decoded.id },
            { $push: { cart: productid } },
            { new: true } // Return the updated document
          );
          req.flash("success","Added to cart successfully")
          res.redirect("/shop");
    }catch(err){
      req.flash("error","Some Error occured");
      res.redirect("/shop")
    }

}

module.exports.removeProdCart = async (req,res)=>{
    try{
        productid = req.params.productId
        prevses = req.session.prevUrl;
        let user = await userModel.findByIdAndUpdate(
            {_id:req.user.id},
            { $pull: { cart:productid } },
            { new: true, useFindAndModify: false },
        )
        // console.log(user)
        res.redirect(`${prevses}`)
    }catch(err){
      req.flash("error","Some Error occured");
      res.redirect(req.session.prevUrl)
    }
}

module.exports.deleteProduct = async (req,res)=>{
    productId = req.params.productid
    try{
        await userModel.updateMany({}, { $pull: { cart: productId  } });
        let delprod = await productModel.findByIdAndDelete(productId)
        req.flash("success","Deleted Successfully")
        res.redirect("/owner/admin")
    }catch(err){
        req.flash("error","Error Deliting The Product")
        res.redirect("/owner/admin")
    }
}

module.exports.deleteAll= async(req,res)=>{
    try{
        await productModel.deleteMany({});
        req.flash("success","All Products Deleted successfully")
        res.redirect("/owner/admin")
    }catch(err){
        res.flash("error",err.messaage)
        res.redirect("/owner/admin")
    }
}

module.exports.updatepage = async(req,res)=>{
    try{
        const product = await productModel.findById(req.params.productid)
        res.render("update",{product});
    }catch(err){
      req.flash("error","Some Error occured");
      res.redirect("/owner/admin")
    }
}

module.exports.UpdateProduct = async(req,res)=>{
    try{
        const {name,price,discount,bgColour,panelColor,textColor} = req.body;
        const updatedProd = await productModel.findByIdAndUpdate(req.params.productid,{
            name,price,discount,bgColour,panelColor,textColor
        })
        req.flash("success","Product updated Successfully")
        res.redirect("/owner/admin")
    }catch(err){
      req.flash("error","Some Error occured");
      res.redirect("/owner/admin")
    }
}

module.exports.renderpror =  (req, res) => {
    try{
        let error = req.flash("error");
        let success = req.flash("success");
        res.render("createproducts", { error, success });
    }catch(err){
      req.flash("error","Some Error occured");
      res.redirect("/owner/admin")
    }
  }

module.exports.Searchfind = async (req, res) => {
    try {
      let user = req.user;
      let success = req.flash("success");
      let error = req.flash("error");
      let { Search } = req.query; // Retrieve the search query from req.query
      if (!Search || Search.trim().length === 0) {
        req.flash("error", "Nothing to find!!");
        res.redirect("/shop");
      } else {
        let products = await productModel.find({
          name: { $regex: Search, $options: "i" }
        });
        if (products.length === 0) {
          req.flash("error", "No product found");
          res.redirect("/shop");
        } else {
          res.render("userSearch", { success, error, products, user });
        }
      }
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/shop");
    }
}