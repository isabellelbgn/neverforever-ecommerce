const discountModel = require("../models/discountModel");

exports.validateDiscount = async (req, res) => {
  const { discountCode } = req.body;

  try {
    const discount = await discountModel.getDiscount(discountCode);

    if (discount) {
      const currentDate = new Date();
      const validFrom = new Date(discount.product_discount_validFrom);
      const validUntil = new Date(discount.product_discount_validUntil);

      if (currentDate >= validFrom && currentDate <= validUntil) {
        res.json({
          valid: true,
          percentage: discount.product_discount_percentage,
        });
        return;
      }
    }
  } catch (error) {
    console.error("Error validating discount:", error);
  }

  res.json({ valid: false });
};
