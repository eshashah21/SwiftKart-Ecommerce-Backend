const jwtProvider = require("../config/jwtProvider");
const userService = require("../services/User.Service");

/**
 * Middleware to authenticate users using JWT.
 */
const authenticate = async (req, res, next) => {
    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization?.split(" ")[1];

        // Check if the token is present
        if (!token) {
            return res.status(401).json({ error: "Token not found." });
        }

        // Verify the token and extract user ID
        const userId = jwtProvider.getUserIdFromToken(token);

        // Fetch user details from the database
        const user = await userService.findUserById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Attach user to the request object for further use
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token." });
    }
};

/**
 * Middleware to authorize users based on their role.
 * @param {string} role - Required user role for access.
 */
const authorize = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ error: "Access denied." });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
