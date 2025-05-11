const express = require('express');
const { authenticate, authorize } = require('../middleware/Authenticate');
const { getUserProfile } = require('../controller/User.Controller'); // Reusing User controller
// const { createProduct } = require("../controller/Product.Controller");
const router = express.Router();

// Protected route to get user profile (any authenticated user can access this)
router.get('/profile', authenticate, getUserProfile);

// Admin-specific route example
router.get('/admin', authenticate, authorize('ROLE_ADMIN'), (req, res) => {
    res.send({ message: 'Welcome to the admin dashboard!' });
});

module.exports = router;