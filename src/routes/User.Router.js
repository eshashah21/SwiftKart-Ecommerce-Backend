const express = require("express");
const router = express.Router();
const UserContorller = require("../controller/User.Controller");

router.get("/profile", UserContorller.getUserProfile);
router.get("/", UserContorller.getAllUsers);

module.exports = router;
