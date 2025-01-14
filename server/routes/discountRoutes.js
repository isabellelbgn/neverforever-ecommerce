const express = require("express");
const discountController = require("../controllers/discountController");
const router = express.Router();

router.post("/validateDiscount", discountController.validateDiscount);

module.exports = router;
