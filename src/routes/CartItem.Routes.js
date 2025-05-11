const express = require("express");
const router = express.Router();
const cartItemController = require("../controller/CartItem.Controller");
const { authenticate } = require("../middleware/Authenticate");

router.put("/:id", authenticate, cartItemController.updateCartItem);
router.delete("/:id", authenticate, cartItemController.removeCartItem);

module.exports = router;