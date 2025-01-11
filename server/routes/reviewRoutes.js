const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.get("/reviews", reviewController.getAllReviews);
router.get("/reviews/:productId", reviewController.getProductReviews);
router.post("/submitreview", reviewController.submitReview);

module.exports = router;
