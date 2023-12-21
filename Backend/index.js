const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;

// DEPENDENCIES
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// ROUTES CONTROLLERS
const userController = require("./app/routes/userRoute");
const productsController = require("./app/routes/productsRoute");
const categoriesController = require("./app/routes/categoriesRoute");
const ordersController = require("./app/routes/ordersRoute");
const ordersItensController = require("./app/routes/ordersItensRoute");

const app = express();

// MIDDLEWARE
app.use(bodyParser.json());
app.use(cookieParser());

// JWT
const { verifyToken } = require("./JWT/JWT");

// MIDDLEWARE
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,PUT,POST,DELETE",
  })
);

// USER ROUTES
app.post("/register", userController);
app.post("/login", userController);
app.put("/changepassword", userController);
app.post("/reset-password/:token", userController);
app.post("/logout", userController);

// PRODUCT ROUTES
app.post("/products", productsController);
app.get("/products", productsController);
app.get("/products/:id", productsController);
app.get("/products/category/:categoryId", productsController);
app.put("/products/:id", productsController);
app.delete("/products/:id", productsController);

// CATEGORIES ROUTES
app.post("/categories", categoriesController);
app.get("/categories", categoriesController);
app.get("/categories/:id", categoriesController);
app.put("/categories/:id", categoriesController);
app.delete("/categories/:id", categoriesController);

// ORDERS ROUTES
app.post("/orders", ordersController);
app.put("/orders/:id", ordersController);
app.get("/orders", ordersController);
app.get("/orders/:id", ordersController);
app.get("/orders/orders-items/:id", ordersController);

// PAYMENT ROUTES
app.get("/payment", verifyToken, (req, res) => {
  res.send("You've done it!");
});

// SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
