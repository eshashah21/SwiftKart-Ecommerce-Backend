const express = require("express");
const router = express.Router();
const orderController = require("../controller/AdminOrder.Controller");
const { authenticate } = require("../middleware/Authenticate");

router.get("/", authenticate, orderController.getAllOrders);
router.put("/:orderId/confirmed", authenticate, orderController.confirmedOrders);
router.put("/:orderId/ship", authenticate, orderController.shippedOrder);
router.put("/:orderId/deliver", authenticate, orderController.deliveredOrder);
router.put("/:orderId/cancel", authenticate, orderController.cancelledOrder);
router.delete("/:orderId/delete", orderController.deletesOrder);

module.exports = router;