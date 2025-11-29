const express = require("express");
const router = express.Router();
const { 
    verifyToken, 
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin 
} = require("../middleware/verifyToken");

// Example 1: Any authenticated user can access
router.get("/profile", verifyToken, (req, res) => {
    res.status(200).json({
        message: "You are authenticated!",
        userId: req.user.id,
        isAdmin: req.user.isAdmin
    });
});

// Example 2: User can only access their own data
router.put("/user/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        // Update user logic here
        res.status(200).json("User updated successfully!");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Example 3: Only admins can access
router.get("/admin/users", verifyTokenAndAdmin, async (req, res) => {
    try {
        // Get all users logic here
        res.status(200).json("All users data");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Example 4: Delete - user can delete their own data OR admin can delete anyone's
router.delete("/user/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        // Delete user logic here
        res.status(200).json("User deleted successfully!");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;