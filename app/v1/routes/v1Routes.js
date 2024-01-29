const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const productsController = require("../controllers/productsControler");
const categoriesController = require("../controllers/categoriesController");
const ordersController = require("../controllers/ordersController");

// USER ROUTES
router.post("/v1/register", userController.createUser);
router.post("/v1/login", userController.loginUser);
router.post("/v1/reset-password", userController.resetPassword);
router.post("/v1/change-password/:token", userController.changePasswordConfirmation);
router.post("/v1/reset-password-logged-user", userController.resetPasswordLoggedUser);
router.post("/v1/logout", userController.logoutUser);

// PRODUCTS ROUTES
router.post("/v1/products", productsController.createProduct);
router.get("/v1/all-products", productsController.getProducts);
router.get("/v1/product/:id", productsController.getProductById);
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
