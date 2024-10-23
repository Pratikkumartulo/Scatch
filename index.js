const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const path = require("path")
const db = require("./config/mongooseConnect")
const ownersRoute = require("./routes/ownerRoute")
const productRoute = require("./routes/productRoute")
const userRoute = require("./routes/userRoute")
const indexRoute = require("./routes/indexRoute")
const session = require('express-session'); 
var flash = require('connect-flash');
require("dotenv").config();

app.use(session({ 
    secret:process.env.SESSION_KEY, 
    saveUninitialized: true, 
    resave: true
})); 
  
app.use(flash()); 

app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname,"public")))

app.use((req, res, next) => {
    req.session.prevUrl = req.session.currUrl || '/';
    req.session.currUrl = req.url;
    next();
  });

app.use("/",indexRoute);
app.use("/owner",ownersRoute);
app.use("/products",productRoute);
app.use("/user",userRoute);

app.listen(3000,function(){
    console.log("Connected !!")
})
