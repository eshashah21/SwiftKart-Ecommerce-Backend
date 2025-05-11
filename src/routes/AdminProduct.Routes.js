// for admin
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/Authenticate");
const productController = require("../controller/Product.Controller");

router.post("/", authenticate, productController.createProduct);
router.post("/creates", authenticate, productController.createMultipleProducts);
router.delete("/:id", authenticate, productController.deleteProduct);
router.put("/:id", authenticate, productController.updateProduct);

module.exports = router;