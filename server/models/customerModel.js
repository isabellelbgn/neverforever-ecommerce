const dbConnection = require("../config/db");
const bcrypt = require("bcrypt");

module.exports = {
  // Register customer
  async registerCustomer(customerData) {
    try {
      const { firstName, lastName, email, username, password } = customerData;
      if (!password) {
        throw new Error("Password is required.");
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(String(password), saltRounds);
      const query = `
            INSERT INTO customer_account (customer_account_firstName, customer_account_lastName, customer_account_emailAddress, customer_account_username, customer_account_password, customer_account_status, customer_account_registeredAt)
            VALUES (?, ?, ?, ?, ?, 'Active', NOW());
        `;
      return dbConnection.query(query, [
        firstName,
        lastName,
        email,
        username,
        hashedPassword,
      ]);
    } catch (error) {
      console.error("Error in registerCustomer:", error.message);
      throw error;
    }
  },

  // Update customer
  async updateCustomer(customerId, customerData) {
    const { firstName, lastName, email, username, password } = customerData;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const updateQuery = `
      UPDATE customer_account
      SET
        customer_account_firstName = ?,
        customer_account_lastName = ?,
        customer_account_emailAddress = ?,
        customer_account_username = ?,
        customer_account_password = ?
      WHERE customer_account_id = ?
    `;
    return dbConnection.execute(updateQuery, [
      firstName,
      lastName,
      email,
      username,
      hashedPassword,
      customerId,
    ]);
  },

  // Find customer by email
  async findCustomerByEmail(email) {
    const query =
      "SELECT * FROM customer_account WHERE customer_account_emailAddress = ?";
    const [results] = await dbConnection.query(query, [email]);
    return results;
  },

  // Get customer data by customerId
  async getCustomerData(customerId) {
    const query =
      "SELECT * FROM customer_account WHERE customer_account_id = ?";
    const [results] = await dbConnection.query(query, [customerId]);
    return results;
  },

  // Get orders for a customer
  async getCustomerOrders(customerId) {
    const ordersQuery = `
      SELECT
        so.*, soi.so_item_id, soi.product_id_fk AS soi_product_id, soi.*, p.product_id AS product_id, p.*, sh.*, sa.*, r.review_id, r.review_comment,
        CASE WHEN rr.so_id_fk IS NOT NULL THEN 1 ELSE 0 END AS isRefundRequested
      FROM sales_order AS so
      JOIN sales_order_item AS soi ON so.so_id = soi.so_id_fk
      JOIN product AS p ON soi.product_id_fk = p.product_id
      JOIN shipping AS sh ON so.shipping_id_fk = sh.shipping_id
      JOIN shipping_address AS sa ON sh.shipping_address_id_fk = sa.shipping_address_id
      LEFT JOIN review AS r ON soi.so_item_id = r.sales_order_item_id_fk
      LEFT JOIN refund_return AS rr ON so.so_id = rr.so_id_fk
      WHERE so.customer_account_id_fk = ? AND so_orderStatus != 'In Progress';
    `;
    const [orders] = await dbConnection.query(ordersQuery, [customerId]);
    return orders;
  },

  // Update order status
  async updateOrderStatus(orderId, newStatus) {
    const sql = "UPDATE sales_order SET so_orderStatus = ? WHERE so_id = ?";
    const [result] = await dbConnection.query(sql, [newStatus, orderId]);
    return result;
  },
};
