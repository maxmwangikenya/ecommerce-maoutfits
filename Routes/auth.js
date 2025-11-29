const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

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

        // Decrypt password
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        
        if (!originalPassword) {
            return res.status(500).json("Error decrypting password");
        }

        
        if (originalPassword !== req.body.password) {
            return res.status(401).json("Wrong credentials!");
        }

        // Generate JWT token
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin || false, 
            },
            process.env.JWT_SEC,
            { expiresIn: "30d" } 
        );

        // Login success  WITHOUT password, include token
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json(err);
    }
});

module.exports = router;