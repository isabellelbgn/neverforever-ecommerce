const dbConnection = require("../config/db");

exports.findById = async (productId) => {
  const query = "SELECT * FROM product WHERE product_id = ?";
  const [rows] = await dbConnection.execute(query, [productId]);
  return rows[0];
};

exports.findNew = async () => {
  const query =
    "SELECT * FROM product ORDER BY product_createdAt DESC LIMIT 3;";
  const [rows] = await dbConnection.query(query);
  return rows;
};

exports.findAvailable = async () => {
  const query =
    "SELECT * FROM product WHERE product_availabilityStatus = 'Available';";
  const [rows] = await dbConnection.query(query);
  return rows;
};
