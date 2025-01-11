const Reward = require("../models/rewardModel");

exports.getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.fetchAllRewards();
    res.status(200).json({ allRewards: rewards });
  } catch (error) {
    console.error("Error fetching rewards:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getRewardById = async (req, res) => {
  try {
    const rewardId = req.params.rewardId;
    const reward = await Reward.fetchRewardById(rewardId);

    if (reward) {
      res.status(200).json(reward);
    } else {
      res.status(404).json({ error: "Reward not found" });
    }
  } catch (error) {
    console.error("Error fetching reward details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
