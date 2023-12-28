const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;

// DEPENDENCIES
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// SWAGGER
const swaggerUI = require("swagger-ui-express");

// ROUTES CONTROLLERS
const userController = require("./app/routes/userRoute");
const productsController = require("./app/routes/productsRoute");
const categoriesController = require("./app/routes/categoriesRoute");
const ordersController = require("./app/routes/ordersRoute");

const app = express();

// MIDDLEWARE
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(require("./swagger.json")));

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
app.put("/change-password", userController);
app.post("/reset-password/:token", userController);
app.post("/logout", userController);

// PRODUCT ROUTES
app.post("/products", productsController);
app.get("/all-products", productsController);
app.get("/products/:id", productsController);
app.get("/products/category/:category-id", productsController);
app.put("/update-product/:id", productsController);
app.delete("/delete-product/:id", productsController);

// CATEGORIES ROUTES
app.post("/categories", categoriesController);
app.get("/all-categories", categoriesController);
app.get("/categories/:id", categoriesController);
app.put("/update-category/:id", categoriesController);
app.delete("/delete-category/:id", categoriesController);

// ORDERS ROUTES
app.post("/orders", ordersController);
app.put("/orders/:id", ordersController);
app.get("/all-orders", ordersController);
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
