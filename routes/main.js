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
    res.render("main", {message:'',user:req.user});
    }else{
        res.redirect("/login");
    }
});

router.get("/add", (req,res)=>{
    if(req.isAuthenticated()){
        res.render("add",{file:1,user:req.user});
    }else{
        res.redirect("/login");
    }
});

module.exports = router;
