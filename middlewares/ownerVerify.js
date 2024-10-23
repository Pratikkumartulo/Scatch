const ownerModel = require("../models/ownersModel");
const jwt = require("jsonwebtoken");


module.exports.verifyOwner = async (req,res,next)=>{
    try{
        if(!req.cookies.owntoken){
            req.flash("error","Webpage is prohibited")
            res.redirect("/")
        }else{
            let owntoken = req.cookies.owntoken
            let decoded = jwt.verify(owntoken, process.env.JWT_KEY);
            let owner = await 
            ownerModel
            .findOne({email:decoded.email})
            .select("-password")
            req.owner = owner;
            next()
        }
    }catch(err){
        req.flash("error","Error visiting the page")
        res.redirect("/owner")
    }
}