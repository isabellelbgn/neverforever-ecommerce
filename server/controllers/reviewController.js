const Review = require("../models/reviewModel");

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.fetchAllReviews();
    res.status(200).json({ allProducts: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await Review.fetchProductReviews(productId);
    res.status(200).json({ productReviews: reviews });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.submitReview = async (req, res) => {
  try {
    const { orderId, productId, salesOrderItemId, comment } = req.body;
    const customerAccountId = req.session.customerAccountId;

    const orderStatus = await Review.getOrderStatus(orderId);

    if (orderStatus !== "Delivered") {
      return res
        .status(400)
        .json({ error: "Cannot submit a review for an undelivered order." });
    }

    await Review.insertReview({
      productId,
      customerAccountId,
      orderId,
      salesOrderItemId,
      comment,
    });

    res.status(200).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error submitting a review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
