const dbConnection = require("../config/db");

module.exports = {
  getDiscount: async (discountCode) => {
    const query = `
      SELECT * 
      FROM product_discount 
      WHERE product_discount_code = ?;
    `;
    const [rows] = await dbConnection.execute(query, [discountCode]);
    return rows.length > 0 ? rows[0] : null;
  },
};
