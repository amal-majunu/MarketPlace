require('dotenv').config();
const router = require("express").Router();
const Products = require("../models/Product");

router.get("/", (req,res)=>{
    res.render("home");
});

router.get("/login", (req,res)=>{
    res.render("login", {message:''});
});

router.get("/register", (req,res)=>{
    res.render("register", {message:''});
});

router.get("/edit", (req,res)=>{
    let user = {
        name : req.user.username,
        email : req.user.email,
        message : ''
    }
    res.render("edit", user);
});

router.get("/main", (req,res)=>{
   if(req.isAuthenticated()){
       let prod = [];
       Products.find({owner:req.user.username},(err,docs)=>{
           if(err){
               console.log(err);
           }else{
               prod = docs;
               res.render("main", {message:'',user:req.user, prod:prod});
           }
       });
    }else{
        res.redirect("/login");
    }
});

router.get("/editpro", (req,res)=>{
    if(req.isAuthenticated()){
        let name = req.query.name;
        Products.findOne({name:name,owner:req.user.username}, (err,doc)=>{
            if(err){
                console.log(err);
            }else if(doc){
                res.render("editpro", {
                    file:1,
                    doc:doc
                });
            }else{
                res.sendStatus(404);
            }
        });
    }else{
        res.redirect("/login");
    }
});

router.get("/products", (req,res)=>{
    if(req.isAuthenticated()){
        let prod = [];
        Products.find({}, (err,docs)=>{
            if(err){
                console.log(err);
            }else {
                docs.forEach(doc => {
                    if(doc.owner !== req.user.username){
                        let f = 1;
                        let cart = req.user.cart;
                        cart.forEach(item => {
                            if(doc.name === item.name){
                                f = 0;
                            }
                        });
                        if(f===1){
                            prod.push(doc);
                        }
                    }
                });        
                res.render("products", {prod:prod});
            }
        });

    }else{
        res.redirect("/login");
    }
});

router.get("/delete", (req,res)=>{
    if(req.isAuthenticated()){
        let id = req.query.id;
        Products.findByIdAndRemove(id,function(err){
            if(!err){
              console.log('Successfully deleted the Product!');
              res.redirect("/main");
            }
            else{
              console.log(err);
              res.send("Some error happened!!");
            }
          });
    }else{
        res.redirect("/login");
    }
});

router.get("/cart", (req,res)=>{
    if(req.isAuthenticated()){
        let cart = req.user.cart;
        let total = 0;
        cart.forEach(item =>{
            total += item.price;
        });
        res.render("cart",{cart : cart,total : total});
    }else{
        res.redirect("/login");
    }
});

router.get("/buy", (req,res) =>{
    if(req.isAuthenticated()){
        let cart = req.user.cart;
        let total = 0;
        cart.forEach(item => {
            total += item.price;
        });
        res.render("buy", {file:1, total:total});  
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

router.get("/logout", (req,res) =>{
    req.logout();
    res.redirect("/login");
});

module.exports = router;
