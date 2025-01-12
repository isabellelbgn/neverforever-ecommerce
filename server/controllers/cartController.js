const Cart = require("../models/cartModel");

exports.addToCart = async (req, res) => {
  try {
    const productId = req.params.product_id;
    const {
      quantity,
      selectedChain,
      selectedChainLength,
      customTextFront,
      customTextBack,
      selectedFont,
    } = req.body;

    if (!req.session.customerAccountId) {
      req.session.customerAccountId =
        await Cart.generateUniqueGuestCustomerId();
    }

    const customerAccountId = req.session.customerAccountId;
    let salesOrderId;

    const existingOrderRows = await Cart.getExistingOrder(customerAccountId);

    if (existingOrderRows.length > 0) {
      salesOrderId = existingOrderRows[0].so_id;
    } else {
      salesOrderId = await Cart.createSalesOrder(customerAccountId);
    }

    req.session.customerSalesOrderId = salesOrderId;

    if (
      quantity !== undefined &&
      selectedChain !== undefined &&
      selectedChainLength !== undefined &&
      customTextFront !== undefined &&
      customTextBack !== undefined &&
      selectedFont !== undefined
    ) {
      const itemData = [
        quantity,
        100,
        selectedChain || null,
        selectedChainLength || null,
        customTextFront || null,
        customTextBack || null,
        selectedFont || null,
        salesOrderId,
        productId,
      ];
      await Cart.addItemToCart(itemData);
      res.status(200).json({ message: "Product added to cart successfully" });
    } else {
      res.status(400).json({ error: "One or more values are missing." });
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const itemId = req.params.so_item_id;

    const cartItem = await Cart.getCartItemById(itemId);
    if (!cartItem) {
      res.status(404).json({ error: "Item not found in the cart." });
      return;
    }

    if (cartItem.so_item_quantity === 1) {
      await Cart.removeItemFromCart(itemId);
    } else {
      await Cart.updateCartItemQuantity(itemId, cartItem.so_item_quantity - 1);
    }

    res.status(200).json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.incrementCartQuantity = async (req, res) => {
  try {
    const itemId = req.params.so_item_id;
    await Cart.incrementCartQuantity(itemId);

    res.status(200).json({ message: "Quantity incremented successfully" });
  } catch (error) {
    console.error("Error incrementing quantity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCartDetails = async (req, res) => {
  try {
    const customerId = req.session.customerAccountId || null;

    if (!customerId) {
      return res.status(200).json([]);
    }

    const cartDetails = await Cart.getCartDetails(customerId);

    if (cartDetails.length === 0) {
      res.status(200).json([]);
    } else {
      res.status(200).json(cartDetails);
    }
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateCartTotal = async (req, res) => {
  try {
    const salesOrderId = req.session.customerSalesOrderId;
    if (!salesOrderId) {
      return res.status(400).json({ error: "Sales Order ID is missing" });
    }

    const totalAmount = await Cart.calculateCartTotal(salesOrderId);
    if (totalAmount === undefined || totalAmount === null) {
      return res.status(400).json({ error: "Total amount calculation failed" });
    }

    await Cart.updateCartTotal(salesOrderId, totalAmount);

    res.status(200).json({ message: "Cart total updated successfully" });
  } catch (error) {
    console.error("Error updating cart total:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
