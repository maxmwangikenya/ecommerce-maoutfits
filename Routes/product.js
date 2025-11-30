// Routes/product.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("./verifyToken");
const mongoose = require("mongoose");

// POST /api/products — Create product (admin only)
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error("Create product error:", err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/products/:id — Update product (admin only)
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json("Product not found!");
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error("Update product error:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/products/:id — Delete product (admin only)
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json("Product not found!");
        }
        res.status(200).json("Product has been deleted.");
    } catch (err) {
        console.error("Delete product error:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/products/find/:id — Get single product (public — no auth needed)
router.get("/find/:id", async (req, res) => {
    try {
        const productId = req.params.id.trim();
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json("Invalid product ID format!");
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json("Product not found!");
        }

        res.status(200).json(product); 
    } catch (err) {
        console.error("Get product error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ GET /api/products — Get ALL products (public)
router.get("/", async (req, res) => {
    const { 
        category, 
        isNew, 
        sort, 
        limit = 20, 
        skip = 0 
    } = req.query;

    try {
        let query = {};

        if (category) {
            query.category = { $regex: category, $options: "i" };
        }

        if (isNew === "true") {
            query.createdAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }; 
        }

        const products = await Product.find(query)
            .sort(sort ? { [sort]: -1 } : { createdAt: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        res.status(200).json(products);
    } catch (err) {
        console.error("Get all products error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;