const dbConnection = require("../config/db");

exports.fetchAllReviews = async () => {
  const query = "SELECT * FROM review";
  const [results] = await dbConnection.query(query);
  return results;
};

exports.fetchProductReviews = async (productId) => {
  const query = `
    SELECT
      r.*,
      CONCAT(c.customer_account_firstName, ' ', c.customer_account_lastName) AS customer_name
    FROM review AS r
    JOIN customer_account AS c ON r.customer_account_id_fk = c.customer_account_id
    WHERE r.product_id_fk = ?;
  `;
  const [results] = await dbConnection.query(query, [productId]);
  return results;
};

exports.getOrderStatus = async (orderId) => {
  const query = "SELECT so_orderStatus FROM sales_order WHERE so_id = ?";
  const [results] = await dbConnection.query(query, [orderId]);
  return results[0]?.so_orderStatus;
};

exports.insertReview = async ({
  productId,
  customerAccountId,
  orderId,
  salesOrderItemId,
  comment,
}) => {
  const query = `
    INSERT INTO review (
      product_id_fk,
      customer_account_id_fk,
      sales_order_id_fk,
      sales_order_item_id_fk,
      review_comment,
      review_date
    ) VALUES (?, ?, ?, ?, ?, NOW());
  `;
  await dbConnection.execute(query, [
    productId,
    customerAccountId,
    orderId,
    salesOrderItemId,
    comment,
  ]);
};
