const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token || req.headers.authorization;
    
    if (authHeader) {
        const token = authHeader.startsWith("Bearer ") 
            ? authHeader.split(" ")[1] 
            : authHeader;
        
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid!");
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        // 🔥 Trim the ID from params
        const userId = req.params.id?.trim();

        // Optional: validate format
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json("Invalid user ID");
        }

        // Compare: both should be strings
        if (req.user.id === userId || req.user.isAdmin) {
            // Attach clean ID to req for route use (optional)
            req.params.id = userId;
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not supposed to do that!");
        }
    });
};

module.exports = { 
    verifyToken, 
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin 
};