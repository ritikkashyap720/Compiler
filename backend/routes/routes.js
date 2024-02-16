const express = require("express");
const handleCompilation = require("../controllers/compiler");
const router = express.Router();

router.post("/",handleCompilation)

module.exports = router
