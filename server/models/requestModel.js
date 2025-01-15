const dbConnection = require("../config/db");

exports.insertRequest = async (rrType, rrReason, rrImage, salesOrderId) => {
  const query = `
    INSERT INTO refund_return (rr_type, rr_reason, rr_imageProof, rr_status, rr_createdAt, so_id_fk)
    VALUES (?, ?, ?, 'Pending', NOW(), ?);
  `;

  const [result] = await dbConnection.execute(query, [
    rrType,
    rrReason,
    rrImage,
    salesOrderId,
  ]);

  return result;
};

exports.updateOrderStatus = async (newStatus, salesOrderId) => {
  const query = `
    UPDATE sales_order
    SET so_orderStatus = ?
    WHERE so_id = ?;
  `;

  await dbConnection.execute(query, [newStatus, salesOrderId]);
};

exports.getRequestByOrderId = async (orderId) => {
  const query = `
    SELECT *
    FROM refund_return
    WHERE so_id_fk = ?;
  `;

  const [results] = await dbConnection.query(query, [orderId]);
  return results.length > 0 ? results[0] : null;
};
