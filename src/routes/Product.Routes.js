// for customer
const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/Authenticate");
const productController = require("../controller/Product.Controller");

// Admin routes
router.post('/add', authenticate, authorize('ROLE_ADMIN'), productController.createProduct);
router.put('/update/:id', authenticate, authorize('ROLE_ADMIN'), productController.updateProduct);
router.delete('/delete/:id', authenticate, authorize('ROLE_ADMIN'), productController.deleteProduct);

// Public routes
router.get('/', productController.getAllProducts);
router.get('/id/:id', productController.findProductById);

module.exports = router;