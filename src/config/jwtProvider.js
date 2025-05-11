const jwt = require('jsonwebtoken');

const SECRET_KEY = "kdsncdwjfnjwnsfcklmdewiofnwlkdmdkamckldnfoiejfwep";

const generateToken = (userId) => {
    return jwt.sign({ userId: userId }, SECRET_KEY, { expiresIn: "48h" });
};

const getUserIdFromToken = (token) => {
    try {
        const decodedToken = jwt.verify(token, SECRET_KEY);
        return decodedToken.userId;
    } catch (error) {
        throw new Error('Token verification failed.');
    }
};

module.exports = { generateToken, getUserIdFromToken };