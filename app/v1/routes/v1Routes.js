const express = require("express");
const session = require("express-session");
const cors = require("cors");
const KEYCLOAK_SECRET = process.env.KEYCLOAK_SESSION_SECRET;
const Keycloak = require("keycloak-connect");
const routeLimiter = require("../../utils/routeRateLimiter");
const globalRateLimiter = require("../../utils/globalRateLimiter");
const checkMacAddress = require("../../utils/routeRateLimiter");
const getmac = require("getmac");
const ip = require("ip");

const router = express.Router();

const userController = require("../controllers/userController");
const productsController = require("../controllers/productsController");
const categoriesController = require("../controllers/categoriesController");
const ordersController = require("../controllers/ordersController");

// GLOBAL RATE LIMITER
router.use(globalRateLimiter);

// CORS
router.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// KEYCLOAK CONFIG
router.use(session({ secret: KEYCLOAK_SECRET, resave: false, saveUninitialized: true }));

const keycloak = new Keycloak({
  store: session.MemoryStore,
  barerOnly: false,
});

router.use(keycloak.middleware());

// IP AND MAC ADDRESS (LOCAL MAC)
router.use((req, res, next) => {
  req.clientIp = ip.address();
  req.macAddress = getmac.default();
  next();
});

// ROUTES UNDER TEST
router.post("/v1/login", checkMacAddress, routeLimiter, userController.loginUser);
router.get("/v1/product/:id", keycloak.protect(), productsController.getProductById);

// ROUTE UNDER TDD
router.get("/v1/all-products", productsController.getProducts);

//
//
//
//
//

// USER ROUTES
router.post("/v1/register", userController.createUser);
router.post("/v1/reset-password", userController.resetPassword);
router.post("/v1/change-password/:token", userController.changePasswordConfirmation);
router.post("/v1/reset-password-logged-user", userController.resetPasswordLoggedUser);
router.post("/v1/logout", userController.logoutUser);

// PRODUCTS ROUTES
router.post("/v1/products", productsController.createProduct);
router.get("/v1/products/category/:categoryId", productsController.getProductsByCategory);
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
