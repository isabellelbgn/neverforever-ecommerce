const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.post("/register", customerController.register);
router.post("/login", customerController.login);
router.get("/account", customerController.account);
router.put("/account", customerController.updateProfile);
router.get("/account/myorders", customerController.myOrders);
router.put(
  "/account/myorders/update/:id",
  customerController.updateOrderStatus
);
router.get("/logout", customerController.logout);

module.exports = router;
