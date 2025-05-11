// for customer
const express = require("express");
const router = express.Router();
const orderController = require("../controller/Order.Controller");
const { authenticate } = require("../middleware/Authenticate");

router.post("/", authenticate, orderController.createOrder);
router.get("/user", authenticate, orderController.orderHistory);
router.get("/:id", authenticate, orderController.findOrderById);
// router.get('/orders', orderController.getAllOrders);
router.get('/', orderController.getAllOrders);

module.exports = router;