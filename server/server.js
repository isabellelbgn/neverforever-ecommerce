const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const customerRoutes = require("./routes/customerRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const discountRoutes = require("./routes/discountRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const requestRoutes = require("./routes/requestRoutes");

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

app.use(customerRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(checkoutRoutes);
app.use(discountRoutes);
app.use(reviewRoutes);
app.use(rewardRoutes);
app.use(requestRoutes);

app.listen(8082, () => {
  console.log("Listening on port 8082");
});
