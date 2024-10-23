const express = require("express");
const router = express.Router();
const ownerModel = require("../models/ownersModel");
const { onwerLogin, logoutOwner,renderAdmin ,loginOwner, OrdersPage} = require("../controllers/ownerAuntent");
const { verifyOwner } = require("../middlewares/ownerVerify");
const {renderpror} = require("../controllers/productControl")
const {ChangeStatus} = require("../controllers/orderControl")
const productModel = require("../models/productModel")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

if (process.env.NODE_ENV) {
  router.post("/create", async (req, res) => {
    const owners = await ownerModel.find();
    if (owners.length > 0) {
      return res.status(501).send("Owners limit reached");
    }
    let { fullname, email, password } = req.body;
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt,async function(err, hash) {
          if(err) return res.send(err.messsage)
          else{
              let createdOwner = await ownerModel.create({
                fullname,
                email,
                password:hash,
              });
              res.status(201).send(createdOwner);
            }
        });
      })
  });
}
router.post("/login", onwerLogin);

router.get("/", loginOwner);

router.get("/admin", verifyOwner,renderAdmin);

router.get("/createprod", verifyOwner, renderpror);

router.get("/logout", logoutOwner);

router.get("/orders",verifyOwner,OrdersPage)

router.post("/orderstatus/:orderid",verifyOwner,ChangeStatus)

router.get("/product/search",async (req, res) => {
  try {
    let success = req.flash("success");
    let error = req.flash("error");
    let { Search } = req.query; // Retrieve the search query from req.query
    if (!Search || Search.trim().length === 0) {
      req.flash("error", "Nothing to find!!");
      res.redirect("/owner/admin");
    } else {
      let products = await productModel.find({
        name: { $regex: Search, $options: "i" }
      });
      if (products.length === 0) {
        req.flash("error", "No product found");
        res.redirect("/owner/admin");
      } else {
        res.render("adminSearch", { success, error, products});
      }
    }
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/owner/admin");
}
})

module.exports = router;
