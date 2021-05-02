const router = require("express").Router();
const bcrypt = require("bcrypt");
const Userdb = require("../models/User");
const SALTROUNDS = 5;

router.get("/", (req, res) => {
  res.render("register", { exists: false });
});

router.post("/", (req, res) => {
  const { name, email } = req.body;

  Userdb.findOne({ email: email }, (err, user) => {
    if (user) {
      res.render("register", { exists: true });
      // user already exists
    } else {
      // add user
      bcrypt.hash(req.body.password, SALTROUNDS, (err, hash) => {
        Userdb.create({
          name: name,
          email: email,
          password: hash,
        }).then((data) => {
          console.log("User added to databases.");
          res.redirect("/login");
        });
      });
    }
  });
});

module.exports = router;
