require('dotenv').config();
const router = require("express").Router();

router.get("/", (req,res)=>{
    res.render("home");
});

router.get("/login", (req,res)=>{
    res.render("login", {message:''});
});

router.get("/register", (req,res)=>{
    res.render("register", {message:''});
});

router.get("/main", (req,res)=>{
   if(req.isAuthenticated()){
       console.log(req.user);
    res.render("main", {message:''});
    }else{
        res.redirect("/login");
    }
});

module.exports = router;
