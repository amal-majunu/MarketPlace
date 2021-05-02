require('dotenv').config();
//const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/user");

exports.login = async (req,res) => {
    try {
        console.log(req.body);     
        let email = req.body.email;
        let password = req.body.password;
        User.findOne({email:email},(err,doc)=>{
            if(err){
                console.log(err);
            }else{
                if(doc){
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
                    res.render("login", {message : 'No such email is registered!!'});
                }
            }
        });        
    } catch (error) {
        console.log(error);        
    }
};

exports.register = async (req,res) => {
    try {
        console.log(req.body);  
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
        }else{
            res.render("register", {message : 'Passwords are not matching!!'});
        }              
    } catch (error) {
        console.log(error);        
    }
};