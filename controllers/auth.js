require('dotenv').config();
//const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/user");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Products = require("../models/Product");

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
                let product = new Products({
                    imageURL : urlCreated,
                    name : name,
                    quan : quan,
                    desc : desc,
                    price : price,
                    owner : req.user.username
                });
                product.save();
                console.log(product);

                await Products.findOne(product,(err,doc)=>{
                    if(err){
                        console.log(err);
                    }else if(doc){
                        req.user.products.push(doc._id);
                        req.user.save();
                        console.log(req.user);
                        res.redirect("/main");
                    }
                });
            }
        });
    }
};