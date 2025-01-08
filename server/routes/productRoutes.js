const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/featuredproduct", productController.getFeaturedProduct);
router.get("/newproducts", productController.getNewProducts);
router.get("/shop", productController.getAvailableProducts);
router.get("/product/:productId", productController.getProductById);

module.exports = router;
