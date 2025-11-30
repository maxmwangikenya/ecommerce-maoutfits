// userRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyTokenAndAuthorization } = require("./verifyToken"); // adjust path if needed

// Register
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json("Wrong credentials!");
        }

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if (!originalPassword || originalPassword !== req.body.password) {
            return res.status(401).json("Wrong credentials!");
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin || false,
            },
            process.env.JWT_SEC,
            { expiresIn: "30d" }
        );

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Update user
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    const userId = req.params.id.trim();

    

    // Validate ObjectId format (optional but recommended)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json("Invalid user ID format!");
    }

    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId, // ← use cleaned ID
            { $set: req.body },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json("User not found!");
        }

        const { password, ...userWithoutPassword } = updatedUser._doc;
        res.status(200).json(userWithoutPassword);
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;