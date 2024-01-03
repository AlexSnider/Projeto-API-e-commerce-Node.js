const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");

router.post("/categories", categoriesController.createCategory);
router.get("/all-categories", categoriesController.getCategory);
router.get("/categories/:id", categoriesController.getCategoryById);
router.put("/update-category/:id", categoriesController.updateCategory);
router.delete("/delete-category/:id", categoriesController.deleteCategory);

module.exports = router;
