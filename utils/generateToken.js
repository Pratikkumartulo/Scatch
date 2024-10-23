const jwt = require("jsonwebtoken")

const genrateToken=(user)=>{
    let token = jwt.sign({email:user.email,id:user._id},process.env.JWT_KEY)
    return token
}
module.exports.genrateToken = genrateToken