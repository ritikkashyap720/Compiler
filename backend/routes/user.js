const express = require("express")
const { handleSignin, handleLogin } = require("../controllers/user");
const { checkAuth } = require("../middleware/auth");
const user = express.Router()

user.post("/signin",handleSignin);
user.post("/login",handleLogin)

module.exports = user