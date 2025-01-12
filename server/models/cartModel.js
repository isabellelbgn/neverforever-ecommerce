const dbConnection = require("../config/db");

// Generate a unique guest customer ID and insert it into the database
exports.generateUniqueGuestCustomerId = async () => {
  const uniqueId = Math.floor(Math.random() * 1000000) + 1;
  const insertGuestCustomerQuery = `
    INSERT INTO customer_account (customer_account_id) VALUES (?);
  `;
  try {
    await dbConnection.execute(insertGuestCustomerQuery, [uniqueId]);
  } catch (error) {
    console.error("Error inserting guest customer:", error);
  }
  return uniqueId;
};

// Get an existing sales order for a customer with "In Progress" status
exports.getExistingOrder = async (customerAccountId) => {
  const existingOrderQuery = `
    SELECT so_id
    FROM sales_order
    WHERE customer_account_id_fk = ? AND so_orderStatus = 'In Progress'
    LIMIT 1;
  `;
  const [rows] = await dbConnection.execute(existingOrderQuery, [
    customerAccountId,
  ]);
  return rows;
};

// Create a new sales order for a customer
exports.createSalesOrder = async (customerAccountId) => {
  const createSalesOrderQuery = `
    INSERT INTO sales_order 
    (so_orderDate, so_totalAmount, so_paymentMethod, so_paymentStatus, so_orderStatus, so_orderNotes, customer_account_id_fk)
    VALUES (NOW(), 0, NULL, NULL, 'In Progress', NULL, ?);
  `;
  const [result] = await dbConnection.execute(createSalesOrderQuery, [
    customerAccountId,
  ]);
  return result.insertId;
};

// Add an item to the cart
exports.addItemToCart = async (itemData) => {
  const insertItemQuery = `
    INSERT INTO sales_order_item 
    (so_item_quantity, so_item_unitPrice, so_item_jewelryChain, so_item_jewelryLength, so_item_jewelryTextFront, so_item_jewelryTextBack, so_item_jewelryFont, so_id_fk, product_id_fk)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  await dbConnection.execute(insertItemQuery, itemData);
};

// Get a cart item by its ID
exports.getCartItemById = async (itemId) => {
  const checkIfItemInCartQuery = `
    SELECT so_item_id, so_item_quantity
    FROM sales_order_item
    WHERE so_item_id = ?;
  `;
  const [rows] = await dbConnection.execute(checkIfItemInCartQuery, [itemId]);
  return rows.length > 0 ? rows[0] : null;
};

// Remove an item from the cart
exports.removeItemFromCart = async (itemId) => {
  const removeItemQuery = `
    DELETE FROM sales_order_item
    WHERE so_item_id = ?;
  `;
  await dbConnection.execute(removeItemQuery, [itemId]);
};

// Update the quantity of a cart item
exports.updateCartItemQuantity = async (itemId, newQuantity) => {
  const updateItemQuery = `
    UPDATE sales_order_item
    SET so_item_quantity = ?
    WHERE so_item_id = ?;
  `;
  await dbConnection.execute(updateItemQuery, [newQuantity, itemId]);
};

// Increment the quantity of a cart item by 1
exports.incrementCartQuantity = async (itemId) => {
  const incrementQuantityQuery = `
    UPDATE sales_order_item
    SET so_item_quantity = so_item_quantity + 1
    WHERE so_item_id = ?;
  `;
  await dbConnection.execute(incrementQuantityQuery, [itemId]);
};

// Get all cart details for a customer
exports.getCartDetails = async (customerAccountId) => {
  const getCartDetailsQuery = `
    SELECT 
      p.product_id, 
      p.product_name, 
      p.product_image, 
      p.product_unitPrice,
      soi.so_item_id,
      soi.so_item_quantity, 
      soi.so_item_jewelryChain, 
      soi.so_item_jewelryLength, 
      soi.so_item_jewelryTextFront,
      soi.so_item_jewelryTextBack,
      soi.so_item_jewelryFont
    FROM product AS p
    JOIN sales_order_item AS soi ON p.product_id = soi.product_id_fk
    JOIN sales_order AS so ON soi.so_id_fk = so.so_id
    WHERE so.customer_account_id_fk = ? AND so.so_orderStatus = 'In Progress';
  `;
  const [rows] = await dbConnection.execute(getCartDetailsQuery, [
    customerAccountId,
  ]);
  return rows;
};

// Calculate the total amount for the cart
exports.calculateCartTotal = async (salesOrderId) => {
  const getCartDetailsQuery = `
    SELECT so_item_quantity, so_item_unitPrice
    FROM sales_order_item
    WHERE so_id_fk = ?;
  `;
  const [rows] = await dbConnection.execute(getCartDetailsQuery, [
    salesOrderId,
  ]);

  if (!rows || rows.length === 0) {
    return 0;
  }

  const totalAmount = rows.reduce((acc, item) => {
    const quantity = item.so_item_quantity || 0;
    const unitPrice = item.so_item_unitPrice || 0;

    return acc + quantity * unitPrice;
  }, 0);

  return totalAmount;
};

// Update the total amount for the sales order
exports.updateCartTotal = async (salesOrderId, totalAmount) => {
  const updateTotalAmountQuery = `
    UPDATE sales_order
    SET so_totalAmount = ?
    WHERE so_id = ?;
  `;
  await dbConnection.execute(updateTotalAmountQuery, [
    totalAmount,
    salesOrderId,
  ]);
};
