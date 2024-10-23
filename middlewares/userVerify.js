const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

module.exports.isLoggedIn = async (req,res,next)=>{
    // console.log(req.cookie.token)
    try{
        if(!req.cookies.token){
            req.flash('error', 'You need to login first');
            res.redirect("/")
        }else{
            let token = req.cookies.token;
            let decoded = jwt.verify(token, process.env.JWT_KEY);
            let user = await 
            userModel
            .findOne({email:decoded.email})
            .select("-password")
            req.user = user;
            // req.flash('success', 'Log in successfull');
            next()
        }

    }catch(error){
        res.flash("error","something went wrong");
        res.redirect("/")
    }
}