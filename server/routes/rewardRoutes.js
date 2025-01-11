const express = require("express");
const router = express.Router();
const rewardController = require("../controllers/rewardController");

router.get("/rewards", rewardController.getAllRewards);
router.get("/rewards/:rewardId", rewardController.getRewardById);

module.exports = router;
