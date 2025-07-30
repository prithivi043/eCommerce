const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ Utility to calculate discount
const calculateDiscount = (price, discountPrice) => {
  if (!price || !discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

// ✅ POST /api/admin/products
router.post("/products", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      image,
      rating,
      count,
    } = req.body;

    if (!name || !description || !price || !image) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const discount = calculateDiscount(price, discountPrice);

    const newProduct = new Product({
      name,
      description,
      price,
      discountPrice,
      discount,
      image,
      rating,
      count,
      stock: count > 0,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("❌ Add product error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET /api/admin/products
router.get("/products", async (req, res) => {
  try {
    const {
      page = 1, limit = 20, sortBy = "price", sortOrder = "asc",
      priceMin, priceMax, ratingMin, discountMin
    } = req.query;

    const filter = {};

    if (priceMin && priceMax) {
      filter.price = { $gte: Number(priceMin), $lte: Number(priceMax) };
    }

    if (ratingMin) {
      filter.rating = { $gte: Number(ratingMin) };
    }

    if (discountMin) {
      filter.discount = { $gte: Number(discountMin) };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ products, totalPages });
  } catch (err) {
    console.error("❌ Fetch products error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PUT /api/admin/products/:id
router.put("/products/:id", async (req, res) => {
  try {
    const { price, discountPrice } = req.body;
    const discount = calculateDiscount(price, discountPrice);

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
          discount,
          stock: req.body.count > 0
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// DELETE a product by ID
router.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
