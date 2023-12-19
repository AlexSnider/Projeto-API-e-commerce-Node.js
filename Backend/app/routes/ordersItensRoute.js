const express = require("express");
const router = express.Router();

const ordersItensController = require("../controllers/ordersItensController");

router.get("/ordersitens", ordersItensController.getAllOrdersItens);
router.get("/ordersitens/:id", ordersItensController.getOrdersItensById);

module.exports = router;
