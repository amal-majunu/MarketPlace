require('dotenv').config();
//const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/user");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Products = require("../models/Product");
const easyinvoice = require("easyinvoice");
const fs = require("fs");
//const { pdf } = require('easyinvoice');
const pdf = require("html-pdf");
const options  = {format : 'A4'};

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
  });

exports.login = async (req,res) => {
    try {
        console.log(req.body);     
        let username = req.body.username;
        let password = req.body.password;
        User.findOne({username:username},(err,doc)=>{
            if(err){
                console.log(err);
            }else{
                if(doc){
                   // console.log(doc);
                    passport.authenticate('user', function (err, user, info) {
                        if (err) {
                            console.log(err);
                        } else if (!user) { 
                            console.log('message: ' + info.message);
                             res.render('login',{message:'Some error occured!!'}); 
                        } else {
                            req.logIn(user, function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                res.redirect("/main");
                            });
                        }
                    })(req, res); 
                    
                }else{
                    res.render("login", {message : 'No such username is registered!!'});
                }
            }
        });        
    } catch (error) {
        console.log(error);        
    }
};

exports.register = async (req,res) => {
    try { 
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;
        let cpassword = req.body.cpassword;
        if(password === cpassword){
            User.findOne({email : email},(err,doc)=>{
                if(err){
                    console.log(err);
                }else if(doc){
                    res.render("register", {message : 'Email already exists!!'});
                }else{
                    User.findOne({username:username},(err,doc)=>{
                        if(err){
                            console.log(err);
                        }else if(doc){
                            res.render("register", {message : 'Username already exists!!'});
                        }
                        else{
                            User.register({username:username,email:email},password,(err,user)=>{
                                if(err){
                                    res.render("register",{message : 'Some error occured!!'});
                                }
                                else{
                                    passport.authenticate('user')(req,res,function(){
                                        res.redirect("/main");
                                    });
                                }
                            });
                        }                   

                    });
                }
            });
        }else{
            res.render("register", {message : 'Passwords are not matching!!'});
        }              
    } catch (error) {
        console.log(error);        
    }
};

exports.add = async (req,res)=>{
    let file = req.file;
    let name = req.body.title;
    let quan = req.body.quan;
    let desc = req.body.desc;  
    let price = req.body.price;
    if(name === ""||desc === ""||quan === ""||price === ""||typeof(file) === "undefined"){
        res.render("add", {file:0,user:req.user});
    }else{
        cloudinary.uploader.upload(req.file.path, async (err,result) => { 
            if(err){
                console.log(err);
            }else{
                let urlCreated = result.secure_url;  
                let product = {
                    imageURL : urlCreated,
                    name : name,
                    quan : quan,
                    desc : desc,
                    price : price
                };

                let product1 = new Products({
                    imageURL : urlCreated,
                    name : name,
                    quan : quan,
                    desc : desc,
                    price : price,
                    owner : req.user.username
                });
                product1.save();
                res.redirect("/main");
            }
        });
    }
};

exports.edit = async (req,res)=>{
    try {
        let username = req.body.username;
        let email = req.body.email;
        let logo = req.body.type;  
        console.log(req.body);    
        User.findOne({email : email},(err,doc)=>{
            if(err){
                console.log(err);
            }else if(doc){
                res.render("edit", {
                    name : username,
                    email : email,
                    message : 'Email already exists!!'
                });
            }else{
                User.findOne({username:username},(err,doc)=>{
                    if(err){
                        console.log(err);
                    }else if(doc){
                        res.render("edit", {
                            name : username,
                            email : email,
                            message : 'Username already exists!!'
                        });
                    }
                    else{
                        User.findByIdAndUpdate(req.user._id,{username:username,email:email,logo:logo},{new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data!");
                            }
                            else{        
                            console.log(doc);
                            res.redirect("/main");
                            }
                        });
                    }                   

                });
            }
        });  
    } catch (err) {
        console.log(err);        
    }
};

exports.addCart = async (req,res)=>{
    try {
        let id = req.query.id;
        Products.findById(id, (err,doc)=>{
            if(err){
                console.log(err);
            }else{
                let x = doc._doc;
                console.log(x);
                let pro = {
                    incart : 1,
                    num : 1
                };
                let prod = {
                    ...pro,
                    ...x
                }
                console.log(prod);
                req.user.cart.push(prod);
                req.user.save();
                res.redirect("/products");
            }
        });     
    } catch (err) {
        console.log(err);        
    }
};

exports.editpro = async (req,res) => {
    try {
        let id = req.query.id;
        console.log(req.file);
        Products.findById(id, (err,doc)=>{
            if(err){
                console.log(err);
            }else if(doc){
                doc.name = req.body.name;
                doc.desc = req.body.desc;
                doc.quan = req.body.quan;
                doc.price = req.body.price;
                if(req.file !== undefined){
                    cloudinary.uploader.upload(req.file.path, async (err,result) => { 
                        if(err){
                            console.log(err);
                        }else{
                            let urlCreated = result.secure_url;
                            doc.imageURL = urlCreated;
                        }
                    });
                }
                doc.save();
                res.redirect("/main");
            }
        });
    } catch (err) {
        console.log(err);        
    }
};

exports.buy = async (req,res) => {
    try {
        console.log(req.body);
        let doc = req.body;  
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;
        let cart = req.user.cart;
        req.user.products.push(...cart);
        req.user.cart = [];
        req.user.save();
        res.render("paydone", {user:req.user, doc:doc,cart:cart,today:today}, (err,html) => {
            let fn = './public/uploads/'+ req.user.username + '_' + dd+mm+yyyy + '.pdf';
            pdf.create(html,options).toFile(fn,(err,result)=>{
                if(err){
                    console.log(err);
                }else{
                    var file = fs.readFileSync(fn);
                    
                    res.header('content-type','application/pdf');
                    res.send(file);
                    console.log('receipt generated');
                }
            });
        });
        // res.render("paydone", {user:req.user, doc:doc,cart:req.user.cart,today:today});
    } catch (err) {
        console.log(err);        
    }
};

exports.rcart = async(req,res) => {
    try {
        let name = req.query.name;
        let cart = req.user.cart;
        console.log(name);
        cart.forEach(item => {
            if(item.name === name){
                cart.pop(item);
            }            
        });
        console.log(cart);
        req.user.cart = cart;
        req.user.save();
        res.redirect("/cart");
             
    } catch (err) {
        console.log(err);        
    }
}

exports.success = async (req,res) => {
    try {
        let doc = req.body;
        let cart = req.user.cart;
        cart.forEach(item => {
            Products.findOne({name : item.name, owner : item.owner}, (err,fnd)=>{
                if(err){
                    console.log(err);
                }else {
                    fnd.quan -=1;
                    fnd.save();                    
                }
            });
        });
        res.render("success",{
            doc : doc
        });

    } catch (err) {
        console.log(err);        
    }
};