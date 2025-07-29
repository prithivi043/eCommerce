// server/routes/admin.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ GET: Filtered products API
// server/routes/admin.js
router.get("/products", async (req, res) => {
  const {
    page = 1, limit = 20, sortBy = "price", sortOrder = "asc",
    priceMin, priceMax, ratingMin, discountMin
  } = req.query;

  const filter = {};

  if (priceMin && priceMax) {
    filter.price = { $gte: priceMin, $lte: priceMax };
  }

  if (ratingMin) {
    filter.rating = { $gte: ratingMin };
  }

  if (discountMin) {
    filter.discount = { $gte: discountMin };
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
});


module.exports = router;
