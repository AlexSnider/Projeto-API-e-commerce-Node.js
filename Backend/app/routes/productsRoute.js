const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsControler");

router.post("/products", productsController.createProduct);
router.get("/all-products", productsController.getProducts);
router.get("/product/:id", productsController.getProductById);
router.get("/products/category/:category-id", productsController.getProductsByCategory);
router.put("/update-product/:id", productsController.updateProduct);
router.delete("/delete-product/:id", productsController.deleteProduct);

module.exports = router;
