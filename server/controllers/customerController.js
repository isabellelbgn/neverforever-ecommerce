const customerModel = require("../models/customerModel");
const bcrypt = require("bcrypt");

module.exports = {
  // Register or update customer
  async register(req, res) {
    try {
      const { password } = req.body;
      if (!password || typeof password !== "string") {
        return res
          .status(400)
          .json({ error: "Password is required and must be a string." });
      }

      const guestCustomerAccountId = req.session.customerAccountId;
      console.log("Guest Customer ID:", guestCustomerAccountId);

      if (guestCustomerAccountId) {
        await customerModel.updateCustomer(guestCustomerAccountId, req.body);
        delete req.session.customerAccountId;
        console.log("Customer updated successfully");
        res.status(200).json({ message: "Update successful" });
      } else {
        await customerModel.registerCustomer(req.body);
        console.log("Customer added successfully");
        res.status(200).json({ message: "Registration successful" });
      }
    } catch (error) {
      console.error("Error updating database:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Customer login
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const results = await customerModel.findCustomerByEmail(email);
      if (results.length > 0) {
        const hashedPassword = results[0].customer_account_password;
        console.log("Stored password:", hashedPassword);

        if (!hashedPassword) {
          return res
            .status(404)
            .json({ error: "Password not found for this account" });
        }

        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (isMatch) {
          req.session.customerAccountId = results[0].customer_account_id;
          res.json({ Login: true, customerId: results[0].customer_account_id });
        } else {
          res.json({ Login: false });
        }
      } else {
        res.status(404).json({ error: "No matching records found" });
      }
    } catch (error) {
      console.error("Error fetching customer account:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Fetch customer account data
  async account(req, res) {
    try {
      if (req.session.customerAccountId) {
        const results = await customerModel.getCustomerData(
          req.session.customerAccountId
        );
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
      } else {
        return res.json({ valid: false });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update customer profile
  async updateProfile(req, res) {
    try {
      const { customerId } = req.body;
      if (!customerId) {
        return res.status(400).json({ error: "Customer ID is required" });
      }
      await customerModel.updateCustomer(customerId, req.body);
      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Fetch customer's orders
  async myOrders(req, res) {
    try {
      const orders = await customerModel.getCustomerOrders(
        req.session.customerAccountId
      );
      if (orders.length > 0) {
        res.status(200).json({ orders });
      } else {
        res.status(200).json({ message: "No orders found for the customer." });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update order status
  async updateOrderStatus(req, res) {
    const orderId = req.params.id;
    const newStatus = req.body.newStatus;
    try {
      const result = await customerModel.updateOrderStatus(orderId, newStatus);
      if (result.affectedRows > 0) {
        res.json({ updated: true });
      } else {
        res.json({ updated: false });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ updated: false });
    }
  },

  // Logout customer
  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error logging out:", err);
        return res.status(500).json({ error: "Error logging out" });
      }
      res.json({ loggedOut: true });
    });
  },
};
