const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const authController = require("../controllers/authControllers");
const middlewareController = require("../controllers/middlewareController");

//REGISTER
router.post("/register", authController.registerUser);

//LOGIN
router.post("/login",authController.loginUser);
//RERESH
router.post("/refresh",authController.requestRefreshToken);
//LOG OUT
router.post("/logout",middlewareController.verifyToken, authController.userLogout);
module.exports = router;