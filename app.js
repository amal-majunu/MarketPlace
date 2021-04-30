require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");


app.get("/",(req,res)=>{
    res.render("home");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
    console.log('Server started at port 3000');
});