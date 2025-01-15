const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const upload = require("../config/multerConfig");

router.post("/request", requestController.createRequest);
router.post(
  "/request/upload",
  upload.single("file"),
  requestController.uploadImage
);

router.get(
  "/account/myorders/request/:orderId",
  requestController.getRequestByOrderId
);

module.exports = router;
