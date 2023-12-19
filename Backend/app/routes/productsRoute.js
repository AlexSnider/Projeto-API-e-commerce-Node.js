const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsControler");

router.post("/products", productsController.createProduct);
router.get("/products", productsController.getProducts);
router.get("/products/:id", productsController.getProductById);
router.get("/products/category/:categoryId", productsController.getProductsByCategory);
router.put("/products/:id", productsController.updateProduct);
router.delete("/products/:id", productsController.deleteProduct);

module.exports = router;
