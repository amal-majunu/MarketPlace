require('dotenv').config();
const router = require("express").Router();
const multer = require("multer");
const authController = require("../controllers/auth");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./images");
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname);
    },
  });
  const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const uploads = multer({ storage,fileFilter });

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/add", uploads.single('file'), authController.add);
router.post("/edit", authController.edit);
router.get("/addCart", authController.addCart);
router.post("/editpro", uploads.single("file"), authController.editpro);

module.exports = router;