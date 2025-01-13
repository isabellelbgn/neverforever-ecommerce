const checkoutModel = require("../models/checkoutModel");

exports.checkout = async (req, res) => {
  let connection;
  try {
    console.log("Received data from the frontend:", req.body);

    const customerAccountId = req.session.customerAccountId;
    if (!customerAccountId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const {
      firstName,
      lastName,
      email,
      contactNum,
      streetAddress,
      streetAddressTwo,
      city,
      province,
      zip,
      notes,
      shippingMethod,
      paymentMethod,
      grandTotal,
    } = req.body;

    connection = await checkoutModel.beginTransaction();

    const shippingAddressId = await checkoutModel.insertAddress(connection, {
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
    });

    let salesOrderId = await checkoutModel.checkOrder(
      connection,
      customerAccountId
    );

    if (!salesOrderId) {
      salesOrderId = await checkoutModel.createOrder(
        connection,
        customerAccountId
      );
    }

    const shippingId = await checkoutModel.insertShipping(connection, {
      shippingMethod,
      shippingAddressId,
      salesOrderId,
    });

    await checkoutModel.updateOrder(connection, {
      grandTotal,
      paymentMethod,
      notes,
      shippingId,
      salesOrderId,
    });

    await checkoutModel.updateOrderStatus(connection, {
      salesOrderId,
      status: "Processing",
    });

    await checkoutModel.commitTransaction(connection);

    res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    if (connection) {
      await checkoutModel.rollbackTransaction(connection);
    }
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
