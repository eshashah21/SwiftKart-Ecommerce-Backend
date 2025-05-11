const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/Authenticate");
const ratingController = require("../controller/Rating.Controller");

router.post("/create", authenticate, ratingController.createRating);
router.get("/product/:productId", authenticate, ratingController.getAllRatings);

module.exports = router;