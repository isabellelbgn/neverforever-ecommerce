const dbConnection = require("../config/db");

module.exports = {
  beginTransaction: async () => {
    const connection = await dbConnection.getConnection();
    await connection.beginTransaction();
    return connection;
  },

  rollbackTransaction: async (connection) => {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
  },

  commitTransaction: async (connection) => {
    if (connection) {
      await connection.commit();
      connection.release();
    }
  },

  insertAddress: async (
    connection,
    {
      firstName,
      lastName,
      email,
      contactNum,
      streetAddress,
      streetAddressTwo,
      city,
      province,
      zip,
      customerAccountId,
    }
  ) => {
    const query = `
      INSERT INTO shipping_address (
        shipping_address_firstName,
        shipping_address_lastName,
        shipping_address_emailAddress,
        shipping_address_contactNum,
        shipping_address_streetOne,
        shipping_address_streetTwo,
        shipping_address_city,
        shipping_address_province,
        shipping_address_zipCode,
        customer_account_id_fk
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [result] = await connection.execute(query, [
      firstName,
      lastName,
      email,
      contactNum,
      streetAddress,
      streetAddressTwo,
      city,
      province,
      zip,
      customerAccountId,
    ]);
    return result.insertId;
  },

  checkOrder: async (connection, customerAccountId) => {
    const query = `
      SELECT so_id
      FROM sales_order
      WHERE customer_account_id_fk = ?
        AND so_orderStatus = 'In Progress';
    `;
    const [rows] = await connection.execute(query, [customerAccountId]);
    return rows.length > 0 ? rows[0].so_id : null;
  },

  createOrder: async (connection, customerAccountId) => {
    const query = `
      INSERT INTO sales_order (
        so_orderDate,
        so_totalAmount,
        so_paymentMethod,
        so_paymentStatus,
        so_orderStatus,
        so_orderNotes,
        customer_account_id_fk
      ) VALUES (NOW(), 0, NULL, NULL, 'In Progress', NULL, ?);
    `;
    const [result] = await connection.execute(query, [customerAccountId]);
    return result.insertId;
  },

  insertShipping: async (
    connection,
    { shippingMethod, shippingAddressId, salesOrderId }
  ) => {
    const query = `
      INSERT INTO shipping (
        shipping_method,
        shipping_address_id_fk,
        so_id_fk
      ) VALUES (?, ?, ?);
    `;
    const [result] = await connection.execute(query, [
      shippingMethod,
      shippingAddressId,
      salesOrderId,
    ]);
    return result.insertId;
  },

  updateOrder: async (
    connection,
    { grandTotal, paymentMethod, notes, shippingId, salesOrderId }
  ) => {
    const query = `
      UPDATE sales_order
      SET
        so_totalAmount = ?,
        so_paymentMethod = ?,
        so_paymentStatus = 'Pending',
        so_orderNotes = ?,
        shipping_id_fk = ?
      WHERE so_id = ?;
    `;
    await connection.execute(query, [
      grandTotal,
      paymentMethod,
      notes,
      shippingId,
      salesOrderId,
    ]);
  },

  updateOrderStatus: async (connection, { salesOrderId, status }) => {
    const query = `
      UPDATE sales_order
      SET so_orderStatus = ?
      WHERE so_id = ?;
    `;
    await connection.execute(query, [status, salesOrderId]);
  },
};
