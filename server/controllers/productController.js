const Product = require("../models/productModel");

exports.getFeaturedProduct = async (req, res) => {
  try {
    const featuredProduct = await Product.findById("100");
    res.json(featuredProduct);
  } catch (error) {
    console.error("Error fetching featured product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getNewProducts = async (req, res) => {
  try {
    const newProducts = await Product.findNew();
    res.status(200).json({ newProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAvailableProducts = async (req, res) => {
  try {
    const allProducts = await Product.findAvailable();
    res.status(200).json({ allProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
