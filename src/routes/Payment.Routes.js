const express = require("express");
const router = express.Router();
const {authenticate} = require("../middleware/Authenticate");
const paymentController = require("../controller/Payment.Controller");

router.post("/:id", authenticate, paymentController.createPaymentLink);
router.get("/", authenticate, paymentController.updatePaymentInfo);
// router.put("/", authenticate, paymentController.updatePaymentInfo);

module.exports = router;