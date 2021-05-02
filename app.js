require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy    = require('passport-local').Strategy;
mongoose.connect("mongodb://localhost:27017/usersdb",
  {useNewUrlParser:true,
  useUnifiedTopology: true});

const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session({
  secret : "I am inevitible",
  resave : false,
  saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use('user', new LocalStrategy(User.authenticate()));

passport.serializeUser((entity,done) =>{
  done(null,{id:entity.id,type:entity.type});
});

passport.deserializeUser(function (obj, done) {  
  User.findById(obj.id)
      .then(user => {
          if (user) {            
              done(null, user);
          }
          else {
              done(new Error('user id not found:' + obj.id, null));
          }
      });     
});


app.use("/",require("./routes/main")); 
app.use("/auth", require("./routes/auth"));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
    console.log('Server started at port 3000');
});