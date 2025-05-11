const express = require("express");
const router = express.Router();
const authContorller = require("../controller/Auth.Controller");

router.post("/signup", authContorller.register);
router.post("/signin", authContorller.login);

module.exports = router;