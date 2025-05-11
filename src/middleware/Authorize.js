/**
 * Middleware to authorize users based on their role.
 * @param {string} requiredRole - The role required for access.
 */

const authorize = (requiredRole) => {
    return (req, res, next) => {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated." });
        }

        // Check if the user has the required role
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ error: "Access denied. Insufficient permissions." });
        }

        // Proceed to the next middleware or route handler
        next();
    };
};

module.exports = { authenticate, authorize };
