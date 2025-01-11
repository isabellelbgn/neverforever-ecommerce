const Cart = require("../models/cartModel");

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { product_id } = req.params;
    const customerAccountId =
      req.session.customerAccountId || Cart.generateGuestCustomerId(req);

    const salesOrderId = await Cart.getOrCreateSalesOrder(customerAccountId);

    const {
      quantity,
      selectedChain,
      selectedChainLength,
      customTextFront,
      customTextBack,
      selectedFont,
    } = req.body;

    if (
      !quantity ||
      !selectedChain ||
      !selectedChainLength ||
      !customTextFront ||
      !customTextBack ||
      !selectedFont
    ) {
      return res.status(400).json({ error: "One or more values are missing." });
    }

    await Cart.addOrUpdateCartItem(
      salesOrderId,
      product_id,
      quantity,
      selectedChain,
      selectedChainLength,
      customTextFront,
      customTextBack,
      selectedFont
    );

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { so_item_id } = req.params;
    await Cart.removeItemFromCart(so_item_id);
    res.status(200).json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Cart Details
exports.getCartDetails = async (req, res) => {
  try {
    const customerId = req.session.customerAccountId || null;
    const cartDetails = await Cart.getCartDetails(customerId);
    res.status(200).json(cartDetails);
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update Cart Total
exports.updateCartTotal = async (req, res) => {
  try {
    const salesOrderId = req.session.customerSalesOrderId;
    await Cart.updateCartTotal(salesOrderId);
    res.status(200).json({ message: "Cart total updated successfully" });
  } catch (error) {
    console.error("Error updating cart total:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
