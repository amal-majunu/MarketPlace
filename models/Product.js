const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  desc : String,
  quan : Number,
  rating: {
      type: Number,
      min: 1,
      max: 5,
      default : 1
  },
  rateCount : {
    type : Number,
    default : 0
  },
  owner: String,
  imageURL : String
});

module.exports = mongoose.model("Products", productSchema);