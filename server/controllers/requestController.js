const Request = require("../models/requestModel");

exports.createRequest = async (req, res) => {
  try {
    const { rrType, rrReason, rrImage, salesOrderId } = req.body;

    // Insert the refund/return request
    const insertResult = await Request.insertRequest(
      rrType,
      rrReason,
      rrImage,
      salesOrderId
    );

    // Update the sales order status
    const newOrderStatus =
      rrType === "Refund" ? "Refund Requested" : "Return Requested";

    await Request.updateOrderStatus(newOrderStatus, salesOrderId);

    res.status(200).json({ message: "Request submitted successfully" });
  } catch (error) {
    console.error("Error submitting request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const uploadedImage = req.file.filename;
  res.status(200).json({ message: "Image uploaded", images: [uploadedImage] });
};

exports.getRequestByOrderId = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const refundRequest = await Request.getRequestByOrderId(orderId);

    if (refundRequest) {
      res.status(200).json({ refundRequest });
    } else {
      res.status(404).json({ message: "Refund request not found." });
    }
  } catch (error) {
    console.error("Error fetching refund request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
