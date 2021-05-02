const Userdb = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// req.method -> GET, POST & req.url -> relative url
router.use((req, res, next) => {
  console.log(req.method, `${req.url}login`);
  next();
});

router.get("/", (req, res) => {
  res.render("login", { exists: true });
});

router.post("/", (req, res) => {
  const { email } = req.body;
  // Don't create a variable for password.
  Userdb.findOne({ email: email }, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            res.render("main", { userName: user.name });
          } else {
            res.render("login", { exists: false });
          }
        });
      } else {
        res.render("home");
      }
    }
  });
});

module.exports = router;
