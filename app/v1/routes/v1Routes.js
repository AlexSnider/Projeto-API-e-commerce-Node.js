const express = require("express");
const session = require("express-session");
const Keycloak = require("keycloak-connect");
const rateLimit = require("express-rate-limit");
const ip = require("ip");
const router = express.Router();

const userController = require("../controllers/userController");
const productsController = require("../controllers/productsControler");
const categoriesController = require("../controllers/categoriesController");
const ordersController = require("../controllers/ordersController");

router.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: true }));

const keycloak = new Keycloak({
  store: session.MemoryStore,
  barerOnly: false,
});

router.use(keycloak.middleware());

router.use((req, res, next) => {
  req.clientIp = ip.address();
  next();
});

const limiter = rateLimit({
  windowMs: 0.5 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.clientIp,
  handler: (req, res) => {
    res.status(429).json({
      error: true,
      message: "Too many requests, please try again later.",
      clientIp: req.clientIp,
    });
  },
});

// USER ROUTES
router.post("/v1/register", limiter, userController.createUser);
router.post("/v1/login", limiter, userController.loginUser);
router.post("/v1/reset-password", limiter, userController.resetPassword);
router.post("/v1/change-password/:token", limiter, userController.changePasswordConfirmation);
router.post("/v1/reset-password-logged-user", limiter, userController.resetPasswordLoggedUser);
router.post("/v1/logout", limiter, userController.logoutUser);

// PRODUCTS ROUTES
router.post("/v1/products", productsController.createProduct);
router.get("/v1/all-products", productsController.getProducts);
router.get("/v1/product/:id", productsController.getProductById);
router.get(
  "/v1/products/category/:categoryId",
  keycloak.protect(),
  productsController.getProductsByCategory
);
router.put("/v1/update-product/:id", productsController.updateProduct);
router.delete("/v1/delete-product/:id", productsController.deleteProduct);

// CATEGORIES ROUTES
router.post("/v1/categories", categoriesController.createCategory);
router.get("/v1/all-categories", categoriesController.getCategory);
router.get("/v1/categories/:id", categoriesController.getCategoryById);
router.put("/v1/update-category/:id", categoriesController.updateCategory);
router.delete("/v1/delete-category/:id", categoriesController.deleteCategory);

// ORDERS ROUTES
router.post("/v1/orders", ordersController.createOrder);
router.put("/v1/update-orders/:id", ordersController.updateOrder);
router.get("/v1/all-orders", ordersController.getOrders);
router.get("/v1/orders/:id", ordersController.getOrderById);
router.get("/v1/orders/orders-items/:id", ordersController.getOrdersItensByOrderId);

module.exports = router;
