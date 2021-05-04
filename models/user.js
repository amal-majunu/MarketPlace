const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username : String,
    email : String,
    logo : {
        type : String,
        default : 'user1.jpg'
    },
    password : String,
    products : Array
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Users", userSchema);