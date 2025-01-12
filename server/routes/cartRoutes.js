const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/addtocart/:product_id", cartController.addToCart);
router.delete("/removefromcart/:so_item_id", cartController.removeFromCart);
router.put(
  "/addquantitytocart/:so_item_id",
  cartController.incrementCartQuantity
);
router.get("/cart", cartController.getCartDetails);
router.put("/updatecarttotal", cartController.updateCartTotal);

module.exports = router;
