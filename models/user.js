const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String,
    products : Array
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Users", userSchema);