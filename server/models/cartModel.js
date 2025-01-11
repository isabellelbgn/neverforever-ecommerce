const dbConnection = require("../config/db");

// Generate Guest Customer ID
exports.generateGuestCustomerId = (req) => {
  const uniqueId = Math.floor(Math.random() * 1000000) + 1;
  const query =
    "INSERT INTO customer_account (customer_account_id) VALUES (?);";
  dbConnection.execute(query, [uniqueId]).catch((err) => {
    console.error("Error generating guest customer ID:", err);
  });
  req.session.customerAccountId = uniqueId;
  return uniqueId;
};

// Get or Create Sales Order
exports.getOrCreateSalesOrder = async (customerAccountId) => {
  const query = `
    SELECT so_id FROM sales_order 
    WHERE customer_account_id_fk = ? AND so_orderStatus = 'In Progress' LIMIT 1;
  `;
  const [rows] = await dbConnection.execute(query, [customerAccountId]);

  if (rows.length > 0) {
    return rows[0].so_id;
  }

  // Create new sales order if none exists
  const createOrderQuery = `
    INSERT INTO sales_order (so_orderDate, so_totalAmount, so_orderStatus, customer_account_id_fk) 
    VALUES (NOW(), 0, 'In Progress', ?);
  `;
  const [result] = await dbConnection.execute(createOrderQuery, [
    customerAccountId,
  ]);
  return result.insertId;
};

// Add or Update Cart Item
exports.addOrUpdateCartItem = async (
  salesOrderId,
  productId,
  quantity,
  selectedChain,
  selectedChainLength,
  customTextFront,
  customTextBack,
  selectedFont
) => {
  const checkItemQuery = `
    SELECT so_item_id, so_item_quantity FROM sales_order_item 
    WHERE so_id_fk = ? AND product_id_fk = ?;
  `;
  const [rows] = await dbConnection.execute(checkItemQuery, [
    salesOrderId,
    productId,
  ]);

  if (rows.length === 0) {
    const insertQuery = `
      INSERT INTO sales_order_item 
      (so_item_quantity, so_item_unitPrice, so_item_jewelryChain, so_item_jewelryLength, 
      so_item_jewelryTextFront, so_item_jewelryTextBack, so_item_jewelryFont, so_id_fk, product_id_fk)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const productPriceQuery =
      "SELECT product_unitPrice FROM product WHERE product_id = ?";
    const [productRows] = await dbConnection.execute(productPriceQuery, [
      productId,
    ]);

    if (!productRows.length) {
      throw new Error("Product not found.");
    }

    const unitPrice = productRows[0].product_unitPrice;

    await dbConnection.execute(insertQuery, [
      quantity,
      unitPrice,
      selectedChain || null,
      selectedChainLength || null,
      customTextFront || null,
      customTextBack || null,
      selectedFont || null,
      salesOrderId,
      productId,
    ]);
  } else {
    const currentQuantity = rows[0].so_item_quantity;
    const updateQuery = `
      UPDATE sales_order_item SET so_item_quantity = ? 
      WHERE so_item_id = ?;
    `;
    await dbConnection.execute(updateQuery, [
      currentQuantity + quantity,
      rows[0].so_item_id,
    ]);
  }
};

// Remove Item from Cart
exports.removeItemFromCart = async (so_item_id) => {
  const query = "DELETE FROM sales_order_item WHERE so_item_id = ?";
  await dbConnection.execute(query, [so_item_id]);
};

// Get Cart Details
exports.getCartDetails = async (customerId) => {
  const query = `
    SELECT p.product_id, p.product_name, p.product_image, 
      p.product_unitPrice, soi.so_item_quantity
    FROM product AS p
    JOIN sales_order_item AS soi ON p.product_id = soi.product_id_fk
    JOIN sales_order AS so ON soi.so_id_fk = so.so_id
    WHERE so.customer_account_id_fk = ? AND so.so_orderStatus = 'In Progress';
  `;
  const [rows] = await dbConnection.execute(query, [customerId]);
  return rows;
};

// Update Cart Total
exports.updateCartTotal = async (salesOrderId) => {
  const query = `
    UPDATE sales_order
    SET so_totalAmount = (
      SELECT SUM(so_item_quantity * so_item_unitPrice) 
      FROM sales_order_item 
      WHERE so_id_fk = ?
    )
    WHERE so_id = ?;
  `;
  await dbConnection.execute(query, [salesOrderId, salesOrderId]);
};
