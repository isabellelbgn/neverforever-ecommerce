const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const salt = 10;
const { dbConnection } = require("./db.js");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3001"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
});

app.use(express.static("public"));
app.use(
  session({
    name: "customerAccountId",
    secret: "N4EMAKGIL",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/rrImages");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// function checkAuthentication(req, res, next) {
//   if (req.session.customerAccountId) {
//     next();
//   } else {
//     res.status(401).json({ error: "Unauthorized" });
//   }
// }

//PRODUCTS
app.get("/featuredproduct", async (req, res) => {
  try {
    const featuredProductId = "100";

    const query = "SELECT * FROM product WHERE product_id = ?";
    const [rows] = await dbConnection
      .promise()
      .execute(query, [featuredProductId]);

    const featuredProduct = rows[0];

    res.json(featuredProduct);
  } catch (error) {
    console.error("Error fetching featured product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/newproducts", async (req, res) => {
  try {
    const query = `
      SELECT * FROM product
      ORDER BY product_createdAt DESC
      LIMIT 3;
    `;

    dbConnection.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching products from MySQL:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(200).json({ newProducts: results });
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/shop", async (req, res) => {
  try {
    const query = `
      SELECT * FROM product
      WHERE product_availabilityStatus = 'Available';
    `;

    dbConnection.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching products from MySQL:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(200).json({ allProducts: results });
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/product/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const query = `
      SELECT * FROM product
      WHERE product_id = ?;
    `;

    dbConnection.query(query, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching product from MySQL:", err);
        res.status(500).json({ error: "Internal server error" });
      } else if (results.length === 0) {
        res.status(404).json({ error: "Product not found" });
      } else {
        res.status(200).json({ product: results[0] });
      }
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//CART
function generateUniqueGuestCustomerId() {
  const uniqueId = Math.floor(Math.random() * 1000000) + 1; // Adjust the range as needed

  const insertGuestCustomerQuery = `
    INSERT INTO customer_account (customer_account_id) VALUES (?);
  `;

  dbConnection
    .promise()
    .execute(insertGuestCustomerQuery, [uniqueId])
    .catch((error) => {
      console.error("Error inserting guest customer:", error);
    });

  return uniqueId;
}

app.post("/addtocart/:product_id", async (req, res) => {
  try {
    console.log("Received data from the frontend:", req.body);

    const productId = req.params.product_id;
    console.log("Received product from the frontend:", productId);

    if (!req.session.customerAccountId) {
      req.session.customerAccountId = generateUniqueGuestCustomerId();
    }

    const customerAccountId = req.session.customerAccountId;
    console.log("Received customer from the frontend:", customerAccountId);

    let salesOrderId;

    const existingOrderQuery = `
        SELECT so_id
        FROM sales_order
        WHERE customer_account_id_fk = ? AND so_orderStatus = 'In Progress'
        LIMIT 1;
      `;

    const [existingOrderRows] = await dbConnection
      .promise()
      .execute(existingOrderQuery, [customerAccountId]);

    if (existingOrderRows.length > 0) {
      salesOrderId = existingOrderRows[0].so_id;
    } else {
      const createSalesOrderQuery = `
            INSERT INTO sales_order 
            (so_orderDate, so_totalAmount, so_paymentMethod, so_paymentStatus, so_orderStatus, so_orderNotes, customer_account_id_fk)
            VALUES (NOW(), 0, NULL, NULL, 'In Progress', NULL, ?)
          `;
      const [salesOrderResult] = await dbConnection
        .promise()
        .execute(createSalesOrderQuery, [customerAccountId]);

      salesOrderId = salesOrderResult.insertId;
    }

    req.session.customerSalesOrderId = salesOrderId;

    const {
      quantity,
      selectedChain,
      selectedChainLength,
      customTextFront,
      customTextBack,
      selectedFont,
    } = req.body;

    if (
      quantity !== undefined &&
      selectedChain !== undefined &&
      selectedChainLength !== undefined &&
      customTextFront !== undefined &&
      customTextBack !== undefined &&
      selectedFont !== undefined
    ) {
      const salesOrderId = req.session.customerSalesOrderId;

      const getProductQuery =
        "SELECT product_unitPrice FROM product WHERE product_id = ?";
      const [productRows] = await dbConnection
        .promise()
        .execute(getProductQuery, [productId]);
      const unitPrice = productRows[0].product_unitPrice;

      const checkIfProductInCartQuery = `
        SELECT so_item_id, so_item_quantity
        FROM sales_order_item
        WHERE so_id_fk = ? AND product_id_fk = ?;
      `;

      const [cartRows] = await dbConnection
        .promise()
        .execute(checkIfProductInCartQuery, [salesOrderId, productId]);

      if (cartRows.length === 0) {
        console.log("Before insertItemQuery execution:", {
          quantity,
          unitPrice,
          selectedChain,
          selectedChainLength,
          customTextFront,
          customTextBack,
          selectedFont,
          salesOrderId,
          productId,
        });

        const insertItemQuery = `
          INSERT INTO sales_order_item 
          (so_item_quantity, so_item_unitPrice, so_item_jewelryChain, so_item_jewelryLength, so_item_jewelryTextFront, so_item_jewelryTextBack, so_item_jewelryFont, so_id_fk, product_id_fk)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        await dbConnection
          .promise()
          .execute(insertItemQuery, [
            quantity,
            unitPrice,
            selectedChain || null,
            selectedChainLength || null,
            customTextFront || null,
            customTextBack || null,
            selectedFont || null,
            salesOrderId || null,
            productId || null,
          ]);

        console.log("After insertItemQuery execution");

        const updateTotalAmountQuery = `
          UPDATE sales_order
          SET so_totalAmount = (
            SELECT SUM(so_item_quantity * so_item_unitPrice) 
            FROM sales_order_item 
            WHERE so_id_fk = ?
          )
          WHERE so_id = ?;
        `;

        await dbConnection
          .promise()
          .execute(updateTotalAmountQuery, [salesOrderId, salesOrderId]);

        const updateOrderDateQuery = `
          UPDATE sales_order
          SET so_orderDate = NOW()
          WHERE so_id = ?;
        `;

        await dbConnection
          .promise()
          .execute(updateOrderDateQuery, [salesOrderId]);
      } else {
        const currentQuantity = cartRows[0].so_item_quantity;
        const updateItemQuery = `
          UPDATE sales_order_item
          SET so_item_quantity = ?
          WHERE so_item_id = ?;
        `;

        await dbConnection
          .promise()
          .execute(updateItemQuery, [
            currentQuantity + 1,
            cartRows[0].so_item_id,
          ]);

        const updateTotalAmountQuery = `
          UPDATE sales_order
          SET so_totalAmount = (
            SELECT SUM(so_item_quantity * so_item_unitPrice) 
            FROM sales_order_item 
            WHERE so_id_fk = ?
          )
          WHERE so_id = ?;
        `;

        await dbConnection
          .promise()
          .execute(updateTotalAmountQuery, [salesOrderId, salesOrderId]);

        const updateOrderDateQuery = `
          UPDATE sales_order
          SET so_orderDate = NOW()
          WHERE so_id = ?;
        `;

        await dbConnection
          .promise()
          .execute(updateOrderDateQuery, [salesOrderId]);
      }

      res.status(200).json({ message: "Product added to cart successfully" });
    } else {
      console.error("One or more values are undefined.");
      res.status(400).json({ error: "One or more values are missing." });
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/removefromcart/:so_item_id", async (req, res) => {
  try {
    const itemId = req.params.so_item_id;
    console.log(
      "Received request to remove item with itemId:",
      req.params.so_item_id
    );

    const checkIfItemInCartQuery = `
      SELECT so_item_id, so_item_quantity
      FROM sales_order_item
      WHERE so_item_id = ?;
    `;

    const [cartRows] = await dbConnection
      .promise()
      .execute(checkIfItemInCartQuery, [itemId]);

    if (cartRows.length === 0) {
      console.log("Item not found in the cart:", itemId);
      res.status(404).json({ error: "Item not found in the cart." });
    } else {
      const currentQuantity = cartRows[0].so_item_quantity;

      if (currentQuantity === 1) {
        const removeItemQuery = `
          DELETE FROM sales_order_item
          WHERE so_item_id = ?;
        `;

        await dbConnection.promise().execute(removeItemQuery, [itemId]);
      } else {
        const updateItemQuery = `
          UPDATE sales_order_item
          SET so_item_quantity = ?
          WHERE so_item_id = ?;
        `;

        await dbConnection
          .promise()
          .execute(updateItemQuery, [currentQuantity - 1, itemId]);
      }

      res.status(200).json({ message: "Item removed from cart successfully" });
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.put("/addquantitytocart/:so_item_id", async (req, res) => {
  try {
    const itemId = req.params.so_item_id;
    console.log(
      "Received request to increment quantity for item with itemId:",
      itemId
    );

    const incrementQuantityQuery = `
      UPDATE sales_order_item
      SET so_item_quantity = so_item_quantity + 1
      WHERE so_item_id = ?;
    `;

    await dbConnection.promise().execute(incrementQuantityQuery, [itemId]);

    res.status(200).json({ message: "Quantity incremented successfully" });
  } catch (error) {
    console.error("Error incrementing quantity:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.get("/cart", async (req, res) => {
  try {
    const customerId = req.session.customerAccountId || null;

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

    const [cartRows] = await dbConnection
      .promise()
      .execute(getCartDetailsQuery, [customerId]);

    if (cartRows.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(cartRows);
    console.log("Fetched cart details from MySQL:", cartRows);
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/cart", async (req, res) => {
  const { ids } = req.body;

  try {
    const productDetailsPromises = ids.map(async (productId) => {
      const getProductQuery = `
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
        WHERE p.product_id = ?;
      `;

      const [productRows] = await dbConnection
        .promise()
        .execute(getProductQuery, [productId]);

      return productRows[0];
    });

    const products = await Promise.all(productDetailsPromises);

    if (products.length === 0) {
      return res.status(200).json([]);
    }

    const updateTotalAmountQuery = `
    UPDATE sales_order
    SET so_totalAmount = (
      SELECT SUM(so_item_quantity * so_item_unitPrice)
      FROM sales_order_item
      WHERE so_id_fk = ?
    )
    WHERE so_id = ? AND so_orderStatus = 'In Progress';
  `;

    const salesOrderId = req.session.customerSalesOrderId;
    await dbConnection
      .promise()
      .execute(updateTotalAmountQuery, [salesOrderId, salesOrderId]);

    console.log("Fetched cart details from MySQL:", products);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/updatecarttotal", async (req, res) => {
  try {
    const salesOrderId = req.session.customerSalesOrderId;

    const getCartDetailsQuery = `
      SELECT so_item_quantity, so_item_unitPrice
      FROM sales_order_item
      WHERE so_id_fk = ?;
    `;
    const [cartRows] = await dbConnection
      .promise()
      .execute(getCartDetailsQuery, [salesOrderId]);

    const totalAmount = cartRows.reduce((acc, item) => {
      return acc + item.so_item_quantity * item.so_item_unitPrice;
    }, 0);

    const updateTotalAmountQuery = `
      UPDATE sales_order
      SET so_totalAmount = ?
      WHERE so_id = ?;
    `;
    await dbConnection
      .promise()
      .execute(updateTotalAmountQuery, [totalAmount, salesOrderId]);

    res.status(200).json({ message: "Cart total updated successfully" });
  } catch (error) {
    console.error("Error updating cart total:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

//CHECKOUT
app.post("/checkout", async (req, res) => {
  try {
    console.log("Received data from the frontend:", req.body);

    const customerAccountId = req.session.customerAccountId;
    console.log("Received customer from the frontend:", customerAccountId);

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
      discountcode,
    } = req.body;

    // No discount code yet

    await dbConnection.promise().beginTransaction();

    const insertAddressQuery = `
      INSERT INTO shipping_address (
        shipping_address_firstName,
        shipping_address_lastName,
        shipping_address_emailAddress,
        shipping_address_contactNum,
        shipping_address_streetOne,
        shipping_address_streetTwo,
        shipping_address_city,
        shipping_address_province,
        shipping_address_zipCode,
        customer_account_id_fk
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const [shippingAddressRows] = await dbConnection
      .promise()
      .execute(insertAddressQuery, [
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
      ]);

    const shippingAddressId = shippingAddressRows.insertId;

    const checkOrderQuery = `
      SELECT so_id
      FROM sales_order
      WHERE customer_account_id_fk = ?
        AND so_orderStatus = 'In Progress';
    `;

    const [existingOrderRows] = await dbConnection
      .promise()
      .execute(checkOrderQuery, [customerAccountId]);

    let salesOrderId;

    if (existingOrderRows.length > 0) {
      salesOrderId = existingOrderRows[0].so_id;
    } else {
      const createOrderQuery = `
      INSERT INTO sales_order (
        so_orderDate,
        so_totalAmount,
        so_paymentMethod,
        so_paymentStatus,
        so_orderStatus,
        so_orderNotes,
        customer_account_id_fk
      ) VALUES (NOW(), 0, NULL, NULL, 'In Progress', NULL, ?);
    `;

      const [createResult] = await dbConnection
        .promise()
        .execute(createOrderQuery, [customerAccountId]);

      salesOrderId = createResult.insertId;
    }

    const insertShippingQuery = `
      INSERT INTO shipping (
        shipping_method,
        shipping_address_id_fk,
        so_id_fk
      ) VALUES (?, ?, ?);
    `;

    const [shippingRows] = await dbConnection
      .promise()
      .execute(insertShippingQuery, [
        shippingMethod,
        shippingAddressId,
        salesOrderId,
      ]);

    const shippingId = shippingRows.insertId;

    const updateOrderQuery = `
    UPDATE sales_order
    SET
      so_totalAmount = ?,
      so_paymentMethod = ?,
      so_paymentStatus = 'Pending',
      so_orderNotes = ?,
      shipping_id_fk = ?
    WHERE so_id = ?;
  `;

    await dbConnection
      .promise()
      .execute(updateOrderQuery, [
        grandTotal,
        paymentMethod,
        notes,
        shippingId,
        salesOrderId,
      ]);

    const updateStatusQuery = `
      UPDATE sales_order
      SET so_orderStatus = 'Processing'
      WHERE so_id = ?;
    `;

    await dbConnection.promise().execute(updateStatusQuery, [salesOrderId]);

    const updateOrderDateQuery = `
    UPDATE sales_order
    SET so_orderDate = NOW()
    WHERE so_id = ?;
  `;

    await dbConnection.promise().execute(updateOrderDateQuery, [salesOrderId]);

    await dbConnection.promise().commit();

    res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    await dbConnection.promise().rollback();

    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/validateDiscount", async (req, res) => {
  const { discountCode } = req.body;

  try {
    const [discountRows] = await dbConnection
      .promise()
      .query("SELECT * FROM product_discount WHERE product_discount_code = ?", [
        discountCode,
      ]);

    if (discountRows.length > 0) {
      const currentDate = new Date();
      const validFrom = new Date(discountRows[0].product_discount_validFrom);
      const validUntil = new Date(discountRows[0].product_discount_validUntil);

      if (currentDate >= validFrom && currentDate <= validUntil) {
        const discountPercentage = discountRows[0].product_discount_percentage;
        res.json({ valid: true, percentage: discountPercentage });
        return;
      }
    }
  } catch (error) {
    console.error("Error validating discount:", error);
  }

  res.json({ valid: false });
});

//REVIEWS
app.get("/reviews", async (req, res) => {
  try {
    const query = `
      SELECT * FROM review
    `;

    dbConnection.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching reviews from MySQL:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(200).json({ allProducts: results });
      }
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/reviews/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    const query = `
    SELECT
      r.*,
      CONCAT(c.customer_account_firstName, ' ', c.customer_account_lastName) AS customer_name
    FROM review AS r
    JOIN customer_account AS c ON r.customer_account_id_fk = c.customer_account_id
    WHERE r.product_id_fk = ?;
    `;

    dbConnection.query(query, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching reviews from MySQL:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(200).json({ productReviews: results });
      }
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/submitreview", async (req, res) => {
  try {
    const { orderId, productId, salesOrderItemId, comment, dateSubmitted } =
      req.body;

    const orderStatusQuery =
      "SELECT so_orderStatus FROM sales_order WHERE so_id = ?";
    const [orderStatusRows] = await dbConnection
      .promise()
      .query(orderStatusQuery, [orderId]);
    const orderStatus = orderStatusRows[0].so_orderStatus;

    if (orderStatus !== "Delivered") {
      return res
        .status(400)
        .json({ error: "Cannot submit a review for an undelivered order." });
    }

    const insertReviewQuery =
      "INSERT INTO review (product_id_fk, customer_account_id_fk, sales_order_id_fk, sales_order_item_id_fk, review_comment, review_date) VALUES (?, ?, ?, ?, ?, NOW())";

    await dbConnection
      .promise()
      .execute(insertReviewQuery, [
        productId,
        req.session.customerAccountId,
        orderId,
        salesOrderItemId,
        comment,
      ]);

    res.status(200).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error submitting a review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//REWARD
app.get("/rewards/:rewardId", async (req, res) => {
  try {
    const rewardId = req.params.rewardId;

    const rewardQuery = `
      SELECT customer_reward_name, customer_reward_code, customer_reward_percentage
      FROM customer_reward
      WHERE customer_reward_id = ?;
    `;

    const [rewardDetails] = await dbConnection
      .promise()
      .execute(rewardQuery, [rewardId]);

    if (rewardDetails.length > 0) {
      res.status(200).json({
        customer_reward_name: rewardDetails[0].customer_reward_name,
        customer_reward_code: rewardDetails[0].customer_reward_code,
        customer_reward_percentage: rewardDetails[0].customer_reward_percentage,
      });
    } else {
      res.status(404).json({ error: "Reward not found" });
    }
  } catch (error) {
    console.error("Error fetching reward details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/rewards", async (req, res) => {
  try {
    const query = `
      SELECT * FROM customer_reward
    `;

    dbConnection.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching reviews from MySQL:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(200).json({ allProducts: results });
      }
    });
  } catch (error) {
    console.error("Error fetching rewards:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//REQUEST
app.post("/request", async (req, res) => {
  try {
    const { rrType, rrReason, rrImage, salesOrderId } = req.body;

    const createReturnQuery =
      "INSERT INTO refund_return (rr_type, rr_reason, rr_imageProof, rr_status, rr_createdAt, so_id_fk) VALUES (?, ?, ?, 'Pending', NOW(), ?)";

    const values = [rrType, rrReason, rrImage, salesOrderId];

    dbConnection.query(createReturnQuery, values, (err, result) => {
      if (err) {
        console.error("Error inserting request into the database:", err);
        return res.status(500).json({ message: "Error" });
      }

      const updateOrderStatusQuery =
        "UPDATE sales_order SET so_orderStatus = ? WHERE so_id = ?";

      const newOrderStatus =
        rrType === "Refund" ? "Refund Requested" : "Return Requested";

      dbConnection.query(
        updateOrderStatusQuery,
        [newOrderStatus, salesOrderId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error updating order status:", updateErr);
            return res
              .status(500)
              .json({ message: "Error updating order status" });
          }

          return res.json({ message: "Request submitted successfully" });
        }
      );
    });
  } catch (error) {
    console.error("Error submitting request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/request/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const uploadedImage = req.file.filename;
  return res.json({ message: "Image uploaded", images: [uploadedImage] });
});

app.get("/account/myorders/request/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const refundRequestQuery = `
      SELECT *
      FROM refund_return
      WHERE so_id_fk = ?;
    `;

    const refundRequestResult = await dbConnection
      .promise()
      .query(refundRequestQuery, [orderId]);

    if (refundRequestResult[0].length > 0) {
      const refundRequest = refundRequestResult[0][0];

      return res.status(200).json({ refundRequest });
    } else {
      return res.status(200).json({ message: "Refund request not found." });
    }
  } catch (error) {
    console.error("Error fetching refund request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//CUSTOMERS
app.post("/register", async (req, res) => {
  try {
    const guestCustomerAccountId = req.session.customerAccountId;
    console.log("Guest Customer ID:", guestCustomerAccountId);

    if (guestCustomerAccountId) {
      const updateCustomerAccountQuery = `
        UPDATE customer_account
        SET
          customer_account_firstName = ?,
          customer_account_lastName = ?,
          customer_account_emailAddress = ?,
          customer_account_username = ?,
          customer_account_password = ?,
          customer_account_status = 'Active',
          customer_account_registeredAt = NOW()
        WHERE customer_account_id = ?;
      `;

      const password = req.body.password;
      const hash = await bcrypt.hash(password.toString(), salt);

      await dbConnection
        .promise()
        .query(updateCustomerAccountQuery, [
          req.body.firstName,
          req.body.lastName,
          req.body.email,
          req.body.username,
          hash,
          guestCustomerAccountId,
        ]);

      delete req.session.customerAccountId;

      console.log("Customer updated successfully");
      res.status(200).json({ message: "Update successful" });
    } else {
      const query =
        "INSERT INTO customer_account (`customer_account_firstName`, `customer_account_lastName`, `customer_account_emailAddress`, `customer_account_username`, `customer_account_password`, `customer_account_status`, `customer_account_registeredAt`) VALUES (?, ?, ?, ?, ?, 'Active', NOW())";

      const password = req.body.password;
      const hash = await bcrypt.hash(password.toString(), salt);

      const values = [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.username,
        hash,
      ];

      const results = await dbConnection.promise().query(query, values);

      console.log("Customer added successfully:", results);
      res.status(200).json({ message: "Registration successful" });
    }
  } catch (error) {
    console.error("Error updating database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/login", (req, res) => {
  if (req.session.customerAccountId) {
    res.send({ loggedIn: true, customerId: req.session.customerAccountId });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", (req, res) => {
  const query =
    "SELECT * FROM customer_account WHERE customer_account_emailAddress = ?";
  dbConnection.query(query, [req.body.email], (err, results) => {
    if (err) {
      console.error("Error fetching customer account in MySQL:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        results[0].customer_account_password,
        (err, response) => {
          if (err) {
            return res.status(500).json({ error: "Error in Password" });
          }
          if (response) {
            const checkSalesOrderQuery = `
              SELECT so_id
              FROM sales_order
              WHERE customer_account_id_fk = ?
                AND so_orderStatus = 'In Progress';
            `;

            dbConnection.query(
              checkSalesOrderQuery,
              [results[0].customer_account_id],
              (err, orderRows) => {
                if (err) {
                  console.error("Error checking open sales order:", err);
                  return res
                    .status(500)
                    .json({ error: "Internal server error" });
                }

                if (orderRows.length > 0) {
                  req.session.customerSalesOrderId = orderRows[0].so_id;
                  req.session.customerAccountId =
                    results[0].customer_account_id;
                  res.json({
                    Login: true,
                    customerId: results[0].customer_account_id,
                  });
                } else {
                  const createOrderQuery = `
                    INSERT INTO sales_order (so_orderDate, so_totalAmount, so_paymentMethod, so_paymentStatus, so_orderStatus, so_orderNotes, customer_account_id_fk)
                    VALUES (NOW(), ?, NULL, NULL, 'In Progress', NULL, ?);
                  `;

                  dbConnection.query(
                    createOrderQuery,
                    [0, results[0].customer_account_id],
                    (err, createResult) => {
                      if (err) {
                        console.error("Error creating a new sales order:", err);
                        return res
                          .status(500)
                          .json({ error: "Internal server error" });
                      }

                      req.session.customerSalesOrderId = createResult.insertId;
                      req.session.customerAccountId =
                        results[0].customer_account_id;
                      res.json({
                        Login: true,
                        customerId: results[0].customer_account_id,
                      });
                    }
                  );
                }
              }
            );
          } else {
            return res.json({ Login: false });
          }
        }
      );
    } else {
      return res.status(404).json({ error: "No matching records found" });
    }
  });
});

app.get("/account", (req, res) => {
  console.log(req.session.customerAccountId);

  if (req.session.customerAccountId) {
    const query = `
      SELECT * FROM customer_account
      WHERE customer_account_id = ?; 
    `;

    dbConnection.query(
      query,
      [req.session.customerAccountId],
      (err, results) => {
        if (err) {
          console.error("Error fetching user data in MySQL:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length > 0) {
          const userData = results[0];

          const hasUsername = userData.customer_account_username !== null;
          const hasPassword = userData.customer_account_password !== null;

          if (hasUsername && hasPassword) {
            return res.json({ valid: true, ...userData });
          } else {
            return res.json({
              valid: false,
              message: "Please log in to access your account.",
            });
          }
        } else {
          return res.json({ valid: false });
        }
      }
    );
  } else {
    return res.json({ valid: false });
  }
});

app.put("/account", async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { firstName, lastName, email, username, password, customerId } =
      req.body;

    const updateQuery = `
      UPDATE customer_account
      SET
        customer_account_firstName = ?,
        customer_account_lastName = ?,
        customer_account_emailAddress = ?,
        customer_account_username = ?,
        customer_account_password = ?
      WHERE customer_account_id = ?
    `;

    const updateValues = [
      firstName,
      lastName,
      email,
      username,
      password,
      customerId,
    ];

    await dbConnection.promise().execute(updateQuery, updateValues);

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/account/myorders", async (req, res) => {
  try {
    if (req.session.customerAccountId) {
      const ordersQuery = `
        SELECT
          so.*,
          soi.so_item_id,
          soi.product_id_fk AS soi_product_id,
          soi.*,
          p.product_id AS product_id,
          p.*,
          sh.*,
          sa.*,
          r.review_id,
          r.review_comment,
          CASE WHEN rr.so_id_fk IS NOT NULL THEN 1 ELSE 0 END AS isRefundRequested
        FROM sales_order AS so
        JOIN sales_order_item AS soi ON so.so_id = soi.so_id_fk
        JOIN product AS p ON soi.product_id_fk = p.product_id
        JOIN shipping AS sh ON so.shipping_id_fk = sh.shipping_id
        JOIN shipping_address AS sa ON sh.shipping_address_id_fk = sa.shipping_address_id
        LEFT JOIN review AS r ON soi.so_item_id = r.sales_order_item_id_fk
        LEFT JOIN refund_return AS rr ON so.so_id = rr.so_id_fk
        WHERE so.customer_account_id_fk = ?
          AND so_orderStatus != 'In Progress';
      `;

      const ordersResult = await dbConnection
        .promise()
        .query(ordersQuery, [req.session.customerAccountId]);

      if (ordersResult[0].length > 0) {
        const orders = ordersResult[0];

        return res.status(200).json({ orders });
      } else {
        return res
          .status(200)
          .json({ message: "No orders found for the customer." });
      }
    } else {
      return res.status(400).json({ error: "Customer not authenticated." });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/account/myorders/update/:id", (req, res) => {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  const sql = `
    UPDATE sales_order
    SET so_orderStatus = ?
    WHERE so_id = ?
  `;

  const values = [newStatus, orderId];

  dbConnection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating order status:", err);
      return res.status(500).json({ updated: false });
    }

    if (result.affectedRows > 0) {
      res.json({ updated: true });
    } else {
      res.json({ updated: false });
    }
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).json({ error: "Error logging out" });
    }
    return res.json({ loggedOut: true });
  });
});

app.listen(8082, () => {
  console.log("Listening on port 8082");
});
