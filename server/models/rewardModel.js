const dbConnection = require("../config/db");

exports.fetchAllRewards = async () => {
  const query = "SELECT * FROM customer_reward";
  const [results] = await dbConnection.query(query);
  return results;
};

exports.fetchRewardById = async (rewardId) => {
  const query = `
    SELECT customer_reward_name, customer_reward_code, customer_reward_percentage
    FROM customer_reward
    WHERE customer_reward_id = ?;
  `;
  const [results] = await dbConnection.query(query, [rewardId]);
  return results.length > 0 ? results[0] : null;
};
