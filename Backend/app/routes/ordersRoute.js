const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");

router.post("/orders", ordersController.createOrder);
router.put("/update-orders/:id", ordersController.updateOrder);
router.get("/all-orders", ordersController.getOrders);
router.get("/orders/:id", ordersController.getOrderById);
router.get("/orders/orders-items/:id", ordersController.getOrdersItensByOrderId);

module.exports = router;
