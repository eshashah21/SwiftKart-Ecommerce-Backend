const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/Authenticate");
const reviewController = require("../controller/Review.Controller");

router.post("/create", authenticate, reviewController.createReview);
router.get("/product/:productId", authenticate, reviewController.getAllReviews);

module.exports = router;